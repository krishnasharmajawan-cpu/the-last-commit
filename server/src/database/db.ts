import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: SqlJsDatabase | null = null;
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'the_last_commit.sqlite');

export async function getDb(): Promise<SqlJsDatabase> {
  if (dbInstance) return dbInstance;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Could not read existing db file, creating a fresh one', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  initTables(dbInstance);
  saveDb();
  return dbInstance;
}

export function saveDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist database to file:', err);
  }
}

function initTables(db: SqlJsDatabase): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'organizer',
      created_at TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_code TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      college TEXT NOT NULL,
      year_of_study TEXT NOT NULL,
      github_url TEXT,
      linkedin_url TEXT,
      track TEXT NOT NULL,
      registration_type TEXT NOT NULL DEFAULT 'solo',
      team_name TEXT,
      team_size INTEGER NOT NULL DEFAULT 1,
      team_members TEXT,
      experience_level TEXT NOT NULL,
      tshirt_size TEXT NOT NULL,
      dietary_pref TEXT NOT NULL,
      project_idea TEXT,
      status TEXT NOT NULL DEFAULT 'CONFIRMED',
      checked_in_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

/**
 * Execute query and return rows as objects
 */
export async function queryAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return rows;
}

/**
 * Execute query and return single row as object
 */
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await queryAll<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Execute statement (INSERT, UPDATE, DELETE) and persist
 */
export async function execute(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid: number }> {
  const db = await getDb();
  db.run(sql, params);
  
  // Fetch last insert row id & changes
  const res = db.exec("SELECT last_insert_rowid() AS id, changes() AS changes;");
  let lastInsertRowid = 0;
  let changes = 0;
  if (res.length > 0 && res[0].values.length > 0) {
    lastInsertRowid = res[0].values[0][0] as number;
    changes = res[0].values[0][1] as number;
  }
  saveDb();
  return { changes, lastInsertRowid };
}
