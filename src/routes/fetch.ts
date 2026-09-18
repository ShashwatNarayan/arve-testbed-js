import crypto from "node:crypto";

import { Router } from "express";

import { limiter } from "../limits.js";
import { insertDocument } from "../repository.js";

export const fetchRouter = Router();
fetchRouter.use(limiter);

fetchRouter.post("/docs/import-url", async (req, res) => {
  const url = typeof req.body?.url === "string" ? req.body.url : "";
  if (!url) {
    res.status(400).json({ error: "url is required" });
    return;
  }
  // TESTBED SAST-07
  const resp = await fetch(url);
  const content = Buffer.from(await resp.arrayBuffer());
  const sha256 = crypto.createHash("sha256").update(content).digest("hex");
  const id = insertDocument(url, crypto.randomUUID(), null, sha256, content);
  res.status(201).json({ id, bytes: content.length });
});
