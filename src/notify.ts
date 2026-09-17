const SMTP_RELAY_URL = "https://relay.docvault.internal/v1/send";
const SMTP_RELAY_TOKEN = "yvJvssNp5TZJBziBNzrv9PDPKtyakPeV";

export async function sendConversionFailed(docId: number, recipient: string): Promise<void> {
  await fetch(SMTP_RELAY_URL, {
    method: "POST",
    headers: { authorization: "Bearer " + SMTP_RELAY_TOKEN, "content-type": "application/json" },
    body: JSON.stringify({ to: recipient, subject: "DocVault: conversion of document " + docId + " failed" }),
  });
}
