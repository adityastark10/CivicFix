// ─────────────────────────────────────────────────────────────────────────────
//  db.js  –  SQLite database setup & schema
//  Uses better-sqlite3 (synchronous, zero-config, file-based)
// ─────────────────────────────────────────────────────────────────────────────
const Database = require('better-sqlite3')
const path     = require('path')

// Database file lives next to this file: backend/civicfix.db
const DB_PATH = path.join(__dirname, 'civicfix.db')

const db = new Database(DB_PATH, {
  // Logs every SQL statement in dev — comment out for production
  // verbose: console.log,
})

// ── Performance & safety pragmas ─────────────────────────────────────────────
db.pragma('journal_mode = WAL')   // Write-Ahead Logging — faster concurrent reads
db.pragma('foreign_keys = ON')    // Enforce FK constraints

// ─────────────────────────────────────────────────────────────────────────────
//  SCHEMA
// ─────────────────────────────────────────────────────────────────────────────
db.exec(`
  -- ── Users table ──────────────────────────────────────────────────────────
  CREATE TABLE IF NOT EXISTS users (
    id                TEXT PRIMARY KEY,          -- CF-<timestamp>
    first_name        TEXT NOT NULL,
    last_name         TEXT NOT NULL,
    phone             TEXT NOT NULL UNIQUE,      -- login identifier
    aadhaar           TEXT NOT NULL UNIQUE,      -- 12-digit national ID
    municipality_type TEXT NOT NULL              -- 'urban' | 'rural'
                        CHECK (municipality_type IN ('urban','rural')),
    municipality      TEXT NOT NULL,
    ward              TEXT NOT NULL,
    password_hash     TEXT NOT NULL,
    created_at        TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- ── Sessions / refresh tokens (optional — ready for future use) ───────────
  CREATE TABLE IF NOT EXISTS sessions (
    token_id    TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    issued_at   TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at  TEXT NOT NULL
  );
`)

console.log(`📦  SQLite database ready → ${DB_PATH}`)

module.exports = db

