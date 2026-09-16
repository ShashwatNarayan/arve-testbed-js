import { Router } from "express";

import { db } from "../db.js";
import { limiter } from "../limits.js";

export const searchRouter = Router();
searchRouter.use(limiter);

searchRouter.get("/docs/search", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  // TESTBED SAST-01
  const rows = db.prepare(`SELECT id, title FROM documents WHERE title LIKE '%${q}%'`).all();
  res.json(rows);
});
