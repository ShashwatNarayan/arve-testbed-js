import express, { Router } from "express";
import { limiter } from "../limits.js";

export const settingsRouter = Router();
settingsRouter.use(limiter);

settingsRouter.post("/settings/import", express.text({ type: "*/*" }), (req, res) => {
  let bundle: unknown;
  try {
    // TESTBED SAST-05
    bundle = eval("(" + (req.body as string) + ")");
  } catch {
    res.status(400).json({ error: "bundle must be JSON" });
    return;
  }
  if (typeof bundle !== "object" || bundle === null || Array.isArray(bundle)) {
    res.status(400).json({ error: "bundle must be an object" });
    return;
  }
  res.json({ imported: Object.keys(bundle).sort() });
});
