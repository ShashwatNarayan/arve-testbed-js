import fs from "node:fs";

import Database from "better-sqlite3";

import { DATABASE, STORAGE_DIR } from "./config.js";

fs.mkdirSync(STORAGE_DIR, { recursive: true });

export const db = new Database(DATABASE);

db.exec(`
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    tag TEXT,
    sha256 TEXT,
    content BLOB,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

export interface DocumentRow {
  id: number;
  title: string;
  filename: string;
  tag: string | null;
  sha256: string | null;
  content: Buffer;
  created_at: string;
}
