import path from "node:path";

const baseDir = path.resolve(import.meta.dirname, "..");

export const STORAGE_DIR = process.env.DOCVAULT_STORAGE ?? path.join(baseDir, "storage");
export const DATABASE = process.env.DOCVAULT_DB ?? path.join(baseDir, "docvault.db");
export const PORT = Number(process.env.PORT ?? 3000);
export const SHARE_TTL_SECONDS = 7 * 24 * 3600;
