// src/rituals/validateWebhookLog.js
import crypto from "crypto";
import { readFile } from "../utils/fileAccess.js";

export function validateWebhookLog(path, secret) {
  const raw = readFile(path);
  if (!raw) {
    console.error("❌ Failed to read webhook log:", path);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Invalid JSON in webhook log.");
    return;
  }

  const { headers, body } = parsed;
  const issues = [];

  // Check timestamp freshness
  const timestamp = headers["x-timestamp"];
  const age = Date.now() - new Date(timestamp).getTime();
  if (!timestamp || age > 5 * 60 * 1000) {
    issues.push("⚠️ Timestamp missing or too old.");
  }

  // Check signature
  const signature = headers["x-signature"];
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");

  if (!signature || signature !== expected) {
    issues.push("❌ Signature mismatch or missing.");
  }

  // Scroll narration
  const scroll = [
    `📡 Webhook Validation Scroll`,
    `Headers: ${Object.keys(headers).length}`,
    `Payload lines: ${JSON.stringify(body).split("\n").length}`,
    timestamp ? `🕒 Timestamp: ${timestamp}` : "⚠️ No timestamp found.",
    signature ? `🔐 Signature: ${signature}` : "⚠️ No signature found.",
    issues.length
      ? `❌ Issues:\n- ${issues.join("\n- ")}`
      : "✅ Webhook is authentic and fresh.",
  ].join("\n");

  console.log(scroll);
}