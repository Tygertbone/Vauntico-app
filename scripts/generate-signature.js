import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
const payload = {
  event: "vault_unlocked",
  user: "tyrone",
  tier: "legacy"
};

const signature = crypto
  .createHmac("sha256", secret)
  .update(JSON.stringify(payload))
  .digest("hex");

console.log("✅ Generated Signature:", signature);