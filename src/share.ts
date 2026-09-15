import jwt from "jsonwebtoken";

import { SHARE_TTL_SECONDS } from "./config.js";

export function downloadTicket(docId: number): string {
  // TESTBED SEC-01
  const signingKey = "vDyFBQiuJR8jEUSnRDRHU0suYSX8ObXP";
  return jwt.sign({ doc: docId }, signingKey, { algorithm: "HS256", expiresIn: SHARE_TTL_SECONDS });
}

export function shareLink(docId: number): string {
  return `/docs/${docId}/download`;
}
