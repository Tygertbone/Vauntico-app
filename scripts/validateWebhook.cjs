require('dotenv').config();
const secret = process.env.WEBHOOK_SECRET;
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.error(`
Usage:
  node scripts/validateWebhook.cjs <clientName> <timestamp> <signature|--simulate tampered|expired>

Examples:
  node scripts/validateWebhook.cjs demo-client 2025-10-17T01:30:00Z f4cb3c...
  node scripts/validateWebhook.cjs demo-client 2025-10-17T01:30:00Z --simulate tampered
  node scripts/validateWebhook.cjs demo-client 2025-10-16T23:00:00Z --simulate expired
`);
  process.exit(1);
}

const [clientName, timestamp, signatureOrFlag, maybeSimType] = args;
const payload = JSON.stringify({ message: 'Hello from Vauntico' });
const secret = process.env.WEBHOOK_SECRET;

let signature = signatureOrFlag;

if (signatureOrFlag === '--simulate') {
  const simType = maybeSimType;
  const data = `${timestamp}.${payload}`;
  const validSig = crypto.createHmac('sha256', secret).update(data).digest('hex');

  if (simType === 'tampered') {
    signature = validSig.slice(0, -1) + 'X';
  } else if (simType === 'expired') {
    signature = validSig;
  } else {
    console.error(`Unknown simulation type: ${simType}`);
    process.exit(1);
  }
}

process.env.CLIENT_NAME = clientName;
process.env.TIMESTAMP = timestamp;
process.env.SIGNATURE = signature;
process.env.PAYLOAD = payload;

console.log(`🔮 Validating webhook for ${clientName}...`);
execSync('node scripts/run-webhook-validation.cjs', { stdio: 'inherit' });