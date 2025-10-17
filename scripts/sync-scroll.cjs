const fs = require('fs');
const path = require('path');
const https = require('https');

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error(`
Usage:
  node scripts/sync-scroll.cjs <clientName>

Example:
  node scripts/sync-scroll.cjs demo-client
`);
  process.exit(1);
}

const clientName = args[0];
const scrollPath = path.join(__dirname, `../vault/clients/${clientName}/scrolls/webhook-audit.md`);

if (!fs.existsSync(scrollPath)) {
  console.error('❌ Scroll not found at:', scrollPath);
  process.exit(1);
}

const scroll = fs.readFileSync(scrollPath, 'utf8');
const payload = JSON.stringify({ client: clientName, scroll });

const options = {
  hostname: 'vauntico-ljhzenxwf-tyrones-projects-6eab466c.vercel.app',

  path: '/api/sync-scroll',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log(`✅ Scroll synced for ${clientName}`);
    } else {
      console.error(`❌ Sync failed: ${res.statusCode} ${body}`);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
});

req.write(payload);
req.end();