import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest, generateToken } from '../middlewares/auth';
import { execute, queryOne, queryAll } from '../database/db';

export async function adminLogin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password required.' });
      return;
    }

    const admin = await queryOne('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
}

export async function getAdminProfile(req: AuthRequest, res: Response): Promise<void> {
  res.json({
    success: true,
    admin: req.user
  });
}

export async function getRegistrations(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { search, track, status, year, sort = 'desc' } = req.query;

    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params: any[] = [];

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim().toLowerCase()}%`;
      query += ` AND (
        LOWER(full_name) LIKE ? OR 
        LOWER(email) LIKE ? OR 
        LOWER(college) LIKE ? OR 
        LOWER(ticket_code) LIKE ? OR 
        LOWER(COALESCE(team_name, '')) LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    if (track && typeof track === 'string' && track !== 'ALL') {
      query += ' AND track = ?';
      params.push(track);
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (year && typeof year === 'string' && year !== 'ALL') {
      query += ' AND year_of_study = ?';
      params.push(year);
    }

    const sortOrder = sort === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY id ${sortOrder}`;

    const rows = await queryAll(query, params);

    // Parse team_members JSON safely
    const formatted = rows.map((r) => {
      let parsedMembers = [];
      try {
        parsedMembers = r.team_members ? JSON.parse(r.team_members) : [];
      } catch {
        parsedMembers = [];
      }
      return {
        ...r,
        team_members: parsedMembers
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      registrations: formatted
    });
  } catch (err: any) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve registrations.' });
  }
}

export async function updateRegistrationStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['CONFIRMED', 'PENDING', 'WAITLISTED', 'CHECKED_IN', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
      return;
    }

    const reg = await queryOne('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!reg) {
      res.status(404).json({ success: false, message: 'Registration not found.' });
      return;
    }

    const checkedInAt = status === 'CHECKED_IN' ? (reg.checked_in_at || new Date().toISOString()) : (status !== 'CHECKED_IN' ? null : reg.checked_in_at);

    await execute(
      'UPDATE registrations SET status = ?, checked_in_at = ? WHERE id = ?',
      [status, checkedInAt, id]
    );

    await execute('INSERT INTO activity_logs (action, details, created_at) VALUES (?, ?, ?)', [
      'STATUS_UPDATE',
      `Registration #${id} (${reg.full_name}) status set to ${status} by ${req.user?.username || 'admin'}`,
      new Date().toISOString()
    ]);

    res.json({
      success: true,
      message: `Status updated to ${status}.`,
      status,
      checkedInAt
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error updating status.' });
  }
}

export async function deleteRegistration(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const reg = await queryOne('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!reg) {
      res.status(404).json({ success: false, message: 'Registration not found.' });
      return;
    }

    await execute('DELETE FROM registrations WHERE id = ?', [id]);

    await execute('INSERT INTO activity_logs (action, details, created_at) VALUES (?, ?, ?)', [
      'REGISTRATION_DELETED',
      `Deleted registration #${id} (${reg.full_name}) by ${req.user?.username || 'admin'}`,
      new Date().toISOString()
    ]);

    res.json({ success: true, message: 'Registration deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error deleting registration.' });
  }
}

export async function getAnalytics(req: AuthRequest, res: Response): Promise<void> {
  try {
    const all = await queryAll('SELECT * FROM registrations');
    const MAX_CAPACITY = 300;

    const totalRegistrations = all.length;
    let totalHackers = 0;
    let checkedInHackers = 0;
    let confirmedCount = 0;
    let waitlistCount = 0;
    let pendingCount = 0;

    const trackCounts: Record<string, number> = {};
    const yearCounts: Record<string, number> = {};
    const tshirtCounts: Record<string, number> = {};
    const dietaryCounts: Record<string, number> = {};
    const collegeCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};

    let soloCount = 0;
    let teamCount = 0;

    all.forEach((r) => {
      const size = Number(r.team_size) || 1;
      totalHackers += size;

      if (r.status === 'CHECKED_IN') {
        checkedInHackers += size;
      }
      if (r.status === 'CONFIRMED') confirmedCount++;
      if (r.status === 'WAITLISTED') waitlistCount++;
      if (r.status === 'PENDING') pendingCount++;

      if (r.registration_type === 'team') {
        teamCount++;
      } else {
        soloCount++;
      }

      // Track distribution
      trackCounts[r.track] = (trackCounts[r.track] || 0) + 1;

      // Year distribution
      yearCounts[r.year_of_study] = (yearCounts[r.year_of_study] || 0) + 1;

      // T-shirt size
      tshirtCounts[r.tshirt_size] = (tshirtCounts[r.tshirt_size] || 0) + 1;

      // Dietary
      dietaryCounts[r.dietary_pref] = (dietaryCounts[r.dietary_pref] || 0) + 1;

      // College
      collegeCounts[r.college] = (collegeCounts[r.college] || 0) + 1;

      // Date group
      const dateKey = r.created_at ? r.created_at.substring(0, 10) : 'Recent';
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    });

    const topColleges = Object.entries(collegeCounts)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const timeline = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      success: true,
      analytics: {
        overview: {
          totalRegistrations,
          totalHackers,
          maxCapacity: MAX_CAPACITY,
          occupancyRate: Math.min(100, Math.round((totalHackers / MAX_CAPACITY) * 100)),
          checkedInHackers,
          checkInRate: totalHackers > 0 ? Math.round((checkedInHackers / totalHackers) * 100) : 0,
          confirmedCount,
          waitlistCount,
          pendingCount,
          soloCount,
          teamCount,
          avgTeamSize: totalRegistrations > 0 ? (totalHackers / totalRegistrations).toFixed(1) : '1.0'
        },
        tracks: trackCounts,
        years: yearCounts,
        tshirts: tshirtCounts,
        dietary: dietaryCounts,
        topColleges,
        timeline
      }
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Error compiling analytics.' });
  }
}

export async function exportCsv(req: AuthRequest, res: Response): Promise<void> {
  try {
    const all = await queryAll('SELECT * FROM registrations ORDER BY id ASC');
    
    // Convert to CSV
    const headers = [
      'ID', 'Ticket Code', 'Full Name', 'Email', 'Phone', 'College',
      'Year', 'Track', 'Type', 'Team Name', 'Team Size', 'T-Shirt',
      'Diet', 'Experience', 'Status', 'Checked In At', 'Registered At'
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = all.map((r) => [
      r.id,
      escapeCsv(r.ticket_code),
      escapeCsv(r.full_name),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.college),
      escapeCsv(r.year_of_study),
      escapeCsv(r.track),
      escapeCsv(r.registration_type),
      escapeCsv(r.team_name),
      r.team_size,
      escapeCsv(r.tshirt_size),
      escapeCsv(r.dietary_pref),
      escapeCsv(r.experience_level),
      escapeCsv(r.status),
      escapeCsv(r.checked_in_at),
      escapeCsv(r.created_at)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="the-last-commit-registrations.csv"');
    res.status(200).send(csvContent);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
}

export async function seedDemoData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const names = ['Alex Rivera', 'Priya Sharma', 'David Miller', 'Anika Gupta', 'Chen Wei', 'Fatima Al-Mansoor'];
    const colleges = ['BITS Pilani', 'Georgia Tech', 'IIT Bombay', 'National Univ of Singapore', 'Stanford'];
    const tracks = [
      'Kernel Panic (Systems & Low-Level)',
      'Neural Breach (AI & Agents)',
      'Zero-Day Web (Distributed & Web3)',
      'Cyber Fortress (Security & Crypto)'
    ];

    const created = [];
    for (const name of names) {
      const email = `${name.toLowerCase().replace(' ', '.')}.${Math.floor(Math.random() * 900 + 100)}@hack.dev`;
      const ticketCode = `TLC-2026-${Math.floor(Math.random() * 9000 + 1000)}-DEMO`;
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      const college = colleges[Math.floor(Math.random() * colleges.length)];
      const isTeam = Math.random() > 0.5;

      await execute(
        `INSERT INTO registrations (
          ticket_code, full_name, email, college, year_of_study, track,
          registration_type, team_name, team_size, experience_level, tshirt_size,
          dietary_pref, status, created_at
        ) VALUES (?, ?, ?, ?, '2nd Year', ?, ?, ?, ?, 'Advanced', 'L', 'Vegetarian', 'CONFIRMED', ?)`,
        [
          ticketCode, name, email, college, track,
          isTeam ? 'team' : 'solo',
          isTeam ? `${name.split(' ')[0]}'s Crew` : null,
          isTeam ? 3 : 1,
          new Date().toISOString()
        ]
      );
      created.push({ name, email, ticketCode });
    }

    res.json({
      success: true,
      message: `Successfully generated ${created.length} demo registrations!`,
      created
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to seed demo data.' });
  }
}
