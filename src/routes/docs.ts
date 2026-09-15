import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import express, { Router } from "express";

import { STORAGE_DIR } from "../config.js";
import { getDocument, insertDocument } from "../repository.js";
import { shareLink } from "../share.js";
import { limiter } from "../limits.js";

export const docsRouter = Router();
docsRouter.use(limiter);

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

docsRouter.post("/docs", express.raw({ type: "*/*", limit: "25mb" }), (req, res) => {
  const data = req.body as Buffer;
  const storedName = crypto.randomUUID();
  const sha256 = crypto.createHash("sha256").update(data).digest("hex");
  const title = typeof req.query.title === "string" ? req.query.title : "untitled";
  const tag = typeof req.query.tag === "string" ? req.query.tag : null;
  const id = insertDocument(title, storedName, tag, sha256, data);
  res.status(201).json({ id, sha256, share: shareLink(id) });
});

docsRouter.get("/docs/:id/download", (req, res) => {
  const row = getDocument(Number(req.params.id));
  if (!row) {
    res.sendStatus(404);
    return;
  }
  const name = typeof req.query.name === "string" ? req.query.name : "";
  if (!name) {
    res.type("application/octet-stream").send(row.content);
    return;
  }
  // TESTBED SAST-06
  fs.readFile(path.join(STORAGE_DIR, "converted", name), (err, data) => {
    if (err) {
      res.sendStatus(404);
      return;
    }
    res.type("application/octet-stream").send(data);
  });
});

docsRouter.get("/docs/:id/preview", (req, res) => {
  const row = getDocument(Number(req.params.id));
  if (!row) {
    res.sendStatus(404);
    return;
  }
  const highlight = typeof req.query.highlight === "string" ? req.query.highlight : "";
  // TESTBED SAST-03
  res.send(`<h1>${escapeHtml(row.title)}</h1><p class="match">${highlight}</p>`);
});
