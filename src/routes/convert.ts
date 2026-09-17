import { exec, execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { Router } from "express";

import { STORAGE_DIR } from "../config.js";
import { getDocument } from "../repository.js";
import { limiter } from "../limits.js";

export const convertRouter = Router();
convertRouter.use(limiter);

convertRouter.post("/docs/:id/convert", (req, res) => {
  const row = getDocument(Number(req.params.id));
  if (!row) {
    res.sendStatus(404);
    return;
  }
  const outDir = path.join(STORAGE_DIR, "converted");
  fs.mkdirSync(outDir, { recursive: true });
  const src = path.join(STORAGE_DIR, row.filename);
  fs.writeFileSync(src, row.content);
  const fmt = typeof req.query.format === "string" ? req.query.format : "pdf";
  // TESTBED SAST-02
  exec(`soffice --headless --convert-to ${fmt} --outdir ${outDir} ${src}`, (err) => {
    // TESTBED SAFE-02
    execFile("file", ["--brief", "--mime-type", src], (_e, stdout) => {
      res.json({ ok: !err, sourceType: String(stdout).trim() });
    });
  });
});
