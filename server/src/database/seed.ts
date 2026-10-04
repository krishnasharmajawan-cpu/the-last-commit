import bcrypt from 'bcryptjs';
import { execute, queryOne, getDb } from './db';

export async function seedDatabase() {
  await getDb();

  // 1. Create or check default admin
  const existingAdmin = await queryOne('SELECT id FROM admins WHERE email = ?', ['admin@thelastcommit.dev']);
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('LastCommit2026!', salt);
    await execute(
      `INSERT INTO admins (username, email, password_hash, role, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      ['admin', 'admin@thelastcommit.dev', passwordHash, 'superadmin', new Date().toISOString()]
    );
    console.log('Default admin created: admin@thelastcommit.dev / LastCommit2026!');
  }

  // 2. Check if registrations exist, if not seed sample data
  const regCount = await queryOne<{ count: number }>('SELECT COUNT(*) as count FROM registrations');
  if (regCount && regCount.count < 10) {
    console.log('Seeding initial hackathon registrations...');
    const colleges = [
      'IIT Bombay', 'BITS Pilani', 'Stanford University', 'MIT', 
      'UC Berkeley', 'Carnegie Mellon', 'IIIT Hyderabad', 'National University of Singapore',
      'IIT Delhi', 'VIT Vellore'
    ];
    
    const tracks = [
      'Kernel Panic (Systems & Low-Level)',
      'Neural Breach (AI & Agents)',
      'Zero-Day Web (Distributed & Web3)',
      'Cyber Fortress (Security & Crypto)'
    ];

    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
    const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Hardcore'];
    const tshirts = ['S', 'M', 'L', 'XL', '2XL'];
    const diets = ['Omnivore', 'Vegetarian', 'Vegan', 'Jain', 'Halal'];
    const statuses = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'CHECKED_IN', 'PENDING', 'WAITLISTED'];

    const sampleRegistrations = [
      {
        fullName: 'Elena Rostova',
        email: 'elena.rostova@cyberlab.io',
        phone: '+1-555-0192',
        college: 'MIT',
        year: '2nd Year',
        github: 'https://github.com/elena-rostova',
        linkedin: 'https://linkedin.com/in/elena-rostova',
        track: 'Neural Breach (AI & Agents)',
        type: 'team',
        teamName: 'Subnet Phantom',
        teamSize: 3,
        teamMembers: JSON.stringify([
          { name: 'Kaelen Thorne', email: 'kael@mit.edu', role: 'ML Engineer' },
          { name: 'Mira Vance', email: 'mira.v@mit.edu', role: 'Frontend & UI' }
        ]),
        exp: 'Advanced',
        tshirt: 'M',
        diet: 'Vegetarian',
        idea: 'Autonomous LLM agent cluster detecting zero-day vulnerabilities in live smart contracts.',
        status: 'CHECKED_IN'
      },
      {
        fullName: 'Aarav Patel',
        email: 'aarav.patel@iitb.ac.in',
        phone: '+91-98765-43210',
        college: 'IIT Bombay',
        year: '3rd Year',
        github: 'https://github.com/aarav-sys',
        linkedin: 'https://linkedin.com/in/aarav-patel',
        track: 'Kernel Panic (Systems & Low-Level)',
        type: 'solo',
        teamName: null,
        teamSize: 1,
        teamMembers: null,
        exp: 'Hardcore',
        tshirt: 'L',
        diet: 'Omnivore',
        idea: 'Custom memory allocator in Rust optimized for high-frequency distributed consensus.',
        status: 'CONFIRMED'
      },
      {
        fullName: 'Samantha Chen',
        email: 'schen@berkeley.edu',
        phone: '+1-510-449-2101',
        college: 'UC Berkeley',
        year: '2nd Year',
        github: 'https://github.com/sam-chen-ai',
        linkedin: 'https://linkedin.com/in/samanthachen',
        track: 'Cyber Fortress (Security & Crypto)',
        type: 'team',
        teamName: 'Entropy Zero',
        teamSize: 4,
        teamMembers: JSON.stringify([
          { name: 'David Zhao', email: 'dzhao@berkeley.edu', role: 'Cryptographer' },
          { name: 'Chloe Kim', email: 'ckim@berkeley.edu', role: 'Security Architect' },
          { name: 'Lucas Scott', email: 'lscott@berkeley.edu', role: 'Backend Dev' }
        ]),
        exp: 'Advanced',
        tshirt: 'S',
        diet: 'Vegan',
        idea: 'Zero-knowledge verification layer for verifiable machine learning inference logs.',
        status: 'CONFIRMED'
      },
      {
        fullName: 'Devansh Saxena',
        email: 'devansh@bits-pilani.ac.in',
        phone: '+91-91234-56789',
        college: 'BITS Pilani',
        year: '2nd Year',
        github: 'https://github.com/devansh-bit',
        linkedin: 'https://linkedin.com/in/devanshsaxena',
        track: 'Zero-Day Web (Distributed & Web3)',
        type: 'team',
        teamName: 'Deadlock Breakers',
        teamSize: 2,
        teamMembers: JSON.stringify([
          { name: 'Rohan Iyer', email: 'rohan.i@bits-pilani.ac.in', role: 'Full Stack' }
        ]),
        exp: 'Intermediate',
        tshirt: 'XL',
        diet: 'Vegetarian',
        idea: 'Decentralized ephemeral git hosting with peer-to-peer conflict resolution over WebRTC.',
        status: 'CHECKED_IN'
      },
      {
        fullName: 'Maya Lin',
        email: 'maya.lin@stanford.edu',
        phone: '+1-650-723-2300',
        college: 'Stanford University',
        year: '4th Year',
        github: 'https://github.com/mayalin-code',
        linkedin: 'https://linkedin.com/in/mayalin',
        track: 'Neural Breach (AI & Agents)',
        type: 'solo',
        teamName: null,
        teamSize: 1,
        teamMembers: null,
        exp: 'Hardcore',
        tshirt: 'M',
        diet: 'Omnivore',
        idea: 'Self-healing code synthesis pipeline that auto-resolves git merge conflicts during live deploy.',
        status: 'CONFIRMED'
      },
      {
        fullName: 'Vikram Sengupta',
        email: 'vikram.s@iiit.ac.in',
        phone: '+91-99887-76655',
        college: 'IIIT Hyderabad',
        year: '1st Year',
        github: 'https://github.com/vikrams-dev',
        linkedin: 'https://linkedin.com/in/vikramsengupta',
        track: 'Kernel Panic (Systems & Low-Level)',
        type: 'team',
        teamName: 'BitShift Syndicate',
        teamSize: 3,
        teamMembers: JSON.stringify([
          { name: 'Ananya Rao', email: 'ananya@iiit.ac.in', role: 'Systems Hacker' },
          { name: 'Karthik N', email: 'karthik@iiit.ac.in', role: 'Assembly / C++' }
        ]),
        exp: 'Intermediate',
        tshirt: 'L',
        diet: 'Jain',
        idea: 'Microkernel simulator running in WASM with live visualization of cache invalidation.',
        status: 'CONFIRMED'
      },
      {
        fullName: 'Jordan Taylor',
        email: 'jtaylor@cmu.edu',
        phone: '+1-412-268-2000',
        college: 'Carnegie Mellon',
        year: '3rd Year',
        github: 'https://github.com/jtaylor-cyber',
        linkedin: 'https://linkedin.com/in/jtaylor-cmu',
        track: 'Cyber Fortress (Security & Crypto)',
        type: 'solo',
        teamName: null,
        teamSize: 1,
        teamMembers: null,
        exp: 'Advanced',
        tshirt: '2XL',
        diet: 'Halal',
        idea: 'Hardware-enforced attestation bridge for confidential computing enclaves.',
        status: 'PENDING'
      },
      {
        fullName: 'Tanvi Deshmukh',
        email: 'tanvi.d@iitd.ac.in',
        phone: '+91-97654-32109',
        college: 'IIT Delhi',
        year: '2nd Year',
        github: 'https://github.com/tanvidesh',
        linkedin: 'https://linkedin.com/in/tanvideshmukh',
        track: 'Zero-Day Web (Distributed & Web3)',
        type: 'team',
        teamName: 'Neon Nodes',
        teamSize: 2,
        teamMembers: JSON.stringify([
          { name: 'Pooja Hegde', email: 'pooja@iitd.ac.in', role: 'Backend Lead' }
        ]),
        exp: 'Intermediate',
        tshirt: 'M',
        diet: 'Vegetarian',
        idea: 'Ultra-low latency multiplayer collaborative code editor on CRDTs with cryptographic audit trails.',
        status: 'WAITLISTED'
      }
    ];

    let idCounter = 100;
    for (const r of sampleRegistrations) {
      idCounter++;
      const ticketCode = `TLC-2026-${idCounter.toString().padStart(4, '0')}`;
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString();
      const checkedInAt = r.status === 'CHECKED_IN' ? new Date().toISOString() : null;

      await execute(
        `INSERT INTO registrations (
          ticket_code, full_name, email, phone, college, year_of_study,
          github_url, linkedin_url, track, registration_type, team_name,
          team_size, team_members, experience_level, tshirt_size, dietary_pref,
          project_idea, status, checked_in_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ticketCode, r.fullName, r.email, r.phone, r.college, r.year,
          r.github, r.linkedin, r.track, r.type, r.teamName,
          r.teamSize, r.teamMembers, r.exp, r.tshirt, r.diet,
          r.idea, r.status, checkedInAt, createdAt
        ]
      );
    }

    console.log(`Successfully seeded ${sampleRegistrations.length} demo registrations!`);
  }
}

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding process completed.');
    process.exit(0);
  }).catch((err) => {
    console.error('Error during seeding:', err);
    process.exit(1);
  });
}
