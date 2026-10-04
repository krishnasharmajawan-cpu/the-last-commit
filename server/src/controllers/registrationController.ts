import { Request, Response } from 'express';
import { execute, queryOne, queryAll } from '../database/db';

export async function submitRegistration(req: Request, res: Response): Promise<void> {
  try {
    const {
      fullName,
      email,
      phone,
      college,
      yearOfStudy,
      githubUrl,
      linkedinUrl,
      track,
      registrationType = 'solo',
      teamName,
      teamSize = 1,
      teamMembers,
      experienceLevel = 'Intermediate',
      tshirtSize = 'L',
      dietaryPref = 'Omnivore',
      projectIdea
    } = req.body;

    // Validation
    if (!fullName || !email || !college || !yearOfStudy || !track) {
      res.status(400).json({
        success: false,
        message: 'Required fields missing: Name, Email, College, Year of Study, and Track are mandatory.'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
      return;
    }

    // Check duplicate
    const existing = await queryOne('SELECT id, ticket_code FROM registrations WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existing) {
      res.status(409).json({
        success: false,
        message: `An entry with email ${email} already exists. Ticket Code: ${existing.ticket_code}`,
        ticketCode: existing.ticket_code
      });
      return;
    }

    // Generate unique Ticket Code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const countRow = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM registrations');
    const seq = ((countRow?.count || 0) + 1).toString().padStart(4, '0');
    const ticketCode = `TLC-2026-${seq}-${randomHex}`;

    const createdAt = new Date().toISOString();
    const stringifiedMembers = typeof teamMembers === 'object' ? JSON.stringify(teamMembers) : teamMembers || null;
    const computedTeamSize = registrationType === 'team' ? Math.max(2, Number(teamSize) || 2) : 1;

    await execute(
      `INSERT INTO registrations (
        ticket_code, full_name, email, phone, college, year_of_study,
        github_url, linkedin_url, track, registration_type, team_name,
        team_size, team_members, experience_level, tshirt_size, dietary_pref,
        project_idea, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)`,
      [
        ticketCode,
        fullName.trim(),
        email.trim().toLowerCase(),
        phone ? phone.trim() : null,
        college.trim(),
        yearOfStudy,
        githubUrl ? githubUrl.trim() : null,
        linkedinUrl ? linkedinUrl.trim() : null,
        track,
        registrationType,
        registrationType === 'team' ? (teamName || `${fullName}'s Team`) : null,
        computedTeamSize,
        stringifiedMembers,
        experienceLevel,
        tshirtSize,
        dietaryPref,
        projectIdea ? projectIdea.trim() : null,
        createdAt
      ]
    );

    // Log action
    await execute('INSERT INTO activity_logs (action, details, created_at) VALUES (?, ?, ?)', [
      'NEW_REGISTRATION',
      `Registered: ${fullName} (${email}) - ${track} [Ticket: ${ticketCode}]`,
      createdAt
    ]);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your place at The Last Commit is confirmed.',
      ticket: {
        ticketCode,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        college: college.trim(),
        track,
        registrationType,
        teamName: registrationType === 'team' ? (teamName || `${fullName}'s Team`) : null,
        tshirtSize,
        createdAt
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error processing registration.'
    });
  }
}

export async function getTicketDetails(req: Request, res: Response): Promise<void> {
  try {
    const { ticketCode } = req.params;
    const registration = await queryOne(
      `SELECT ticket_code, full_name, email, college, year_of_study, track, 
              registration_type, team_name, team_size, experience_level, tshirt_size, 
              status, checked_in_at, created_at
       FROM registrations WHERE ticket_code = ?`,
      [ticketCode.trim().toUpperCase()]
    );

    if (!registration) {
      res.status(404).json({ success: false, message: 'Ticket not found.' });
      return;
    }

    res.json({
      success: true,
      ticket: registration
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving ticket.' });
  }
}

export async function getPublicStats(req: Request, res: Response): Promise<void> {
  try {
    const totalReg = await queryOne<{ total: number }>('SELECT COUNT(*) as total FROM registrations');
    const totalHackers = await queryOne<{ sum: number }>('SELECT COALESCE(SUM(team_size), 0) as sum FROM registrations');
    const colleges = await queryOne<{ count: number }>('SELECT COUNT(DISTINCT college) as count FROM registrations');

    res.json({
      success: true,
      stats: {
        registeredTeams: totalReg?.total || 0,
        totalHackers: totalHackers?.sum || 0,
        collegesRepresented: colleges?.count || 0,
        prizePoolUSD: 25000,
        maxCapacity: 300
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
}
