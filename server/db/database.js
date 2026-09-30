import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pkg from 'pg';
const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel / serverless platforms, write fallback to /tmp directory
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Directory init warning:', e);
  }
}

const initialDb = {
  users: {},
  otps: {},
  tasks: {},
  employees: {},
  shifts: {},
  auditLogs: {}
};

// SQL Postgres Connection Pool
let sqlPool = null;

export const getSqlPool = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) return null;

  if (!sqlPool) {
    sqlPool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return sqlPool;
};

// Initialize SQL Tables (DDL)
export const initSqlTables = async () => {
  const pool = getSqlPool();
  if (!pool) return false;

  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          uid VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          role VARCHAR(255),
          business_type VARCHAR(255),
          business_name VARCHAR(255),
          departments TEXT,
          created_at VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS otps (
          email VARCHAR(255) PRIMARY KEY,
          code VARCHAR(20) NOT NULL,
          expires_at BIGINT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          assigned_to VARCHAR(255),
          priority VARCHAR(50),
          status VARCHAR(50),
          deadline VARCHAR(50),
          created_at VARCHAR(50),
          updated_at VARCHAR(50)
        );

        CREATE TABLE IF NOT EXISTS employees (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          role VARCHAR(255),
          department VARCHAR(255),
          avatar_bg VARCHAR(50),
          performance_rating INT,
          retention_status VARCHAR(255),
          review_notes TEXT,
          created_at VARCHAR(50)
        );

        CREATE TABLE IF NOT EXISTS shifts (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          employee_id VARCHAR(255) NOT NULL,
          date VARCHAR(50) NOT NULL,
          shift_type VARCHAR(255),
          status VARCHAR(50),
          notes TEXT,
          created_at VARCHAR(50)
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          action VARCHAR(255) NOT NULL,
          details TEXT,
          timestamp VARCHAR(50)
        );
      `);
      console.log('✅ PostgreSQL SQL Tables Initialized Successfully');
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('SQL Initialization Error:', err);
    return false;
  }
};

// Read Database
export const readDb = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
      } catch (e) {}
      return initialDb;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return initialDb;
  }
};

// Write Database
export const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('File write note (ephemeral filesystem):', err.message);
  }
};
