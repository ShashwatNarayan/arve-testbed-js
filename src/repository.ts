import { db, type DocumentRow } from "./db.js";

export function getDocument(id: number): DocumentRow | undefined {
  // TESTBED SAFE-01
  return db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as DocumentRow | undefined;
}

export function insertDocument(
  title: string, filename: string, tag: string | null, sha256: string, content: Buffer,
): number {
  const result = db
    .prepare("INSERT INTO documents (title, filename, tag, sha256, content) VALUES (?, ?, ?, ?, ?)")
    .run(title, filename, tag, sha256, content);
  return Number(result.lastInsertRowid);
}
