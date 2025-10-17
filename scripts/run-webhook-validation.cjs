const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const clientName = process.env.CLIENT_NAME || 'demo-client';
const webhookSource = 'checkout.vauntico.com';

const headers = {
  'X-Timestamp': process.env.TIMESTAMP,
  'X-Signature': process.env.SIGNATURE,
};

const payload = process.env.PAYLOAD || JSON.stringify({ message: 'Hello from Vauntico' });
const secret = process.env.WEBHOOK_SECRET;

function validateSignature(timestamp, signature, payload, secret) {
  const data = `${timestamp}.${payload}`;
  const hash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return hash === signature;
}

function isFresh(timestamp) {
  const now = Date.now();
  const ts = new Date(timestamp).getTime();
  const diff = Math.abs(now - ts);
  return diff < 5 * 60 * 1000;
}

function appendToClientScroll({ clientName, timestamp, signature, outcome, narration }) {
  const scrollPath = path.join(__dirname, `../vault/clients/${clientName}/scrolls/webhook-audit.md`);
  const entry = `
## ${timestamp}
**Webhook Source:** \`${webhookSource}\`  
**Signature:** \`${signature}\`  
**Outcome:** ${outcome}  
**Narration:** ${narration}

---
`;
  try {
    fs.appendFileSync(scrollPath, entry, 'utf8');
  } catch (err) {
    console.error('❌ Failed to append to scroll:', err.message);
  }
}

console.log(`🔍 Validating webhook for ${clientName}`);
console.log(`  Source: ${webhookSource}`);
console.log(`  Timestamp: ${headers['X-Timestamp']}`);
console.log(`  Signature: ${headers['X-Signature']}`);

const timestamp = headers['X-Timestamp'];
const signature = headers['X-Signature'];

const isAuthentic = validateSignature(timestamp, signature, payload, secret);
const isTimestampFresh = isFresh(timestamp);

if (isAuthentic && isTimestampFresh) {
  console.log('✅ Webhook is authentic and fresh.');
  appendToClientScroll({
    clientName,
    timestamp,
    signature,
    outcome: '✅ Authentic and fresh',
    narration: 'Scroll sealed. Timestamp aligned. Signature verified. The ritual holds.',
  });
} else {
  const outcome = !isAuthentic
    ? '❌ Tampered'
    : '❌ Expired';
  const narration = !isAuthentic
    ? 'Signature mismatch. Tampering suspected. Scroll rejected.'
    : 'Timestamp expired. Ritual failed. Scroll not sealed.';
  console.log(`${outcome}`);
  appendToClientScroll({ clientName, timestamp, signature, outcome, narration });
}