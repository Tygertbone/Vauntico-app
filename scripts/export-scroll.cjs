const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(`
Usage:
  node scripts/export-scroll.cjs <clientName> <format: md|pdf>

Example:
  node scripts/export-scroll.cjs demo-client md
`);
  process.exit(1);
}

const [clientName, format] = args;
const scrollPath = path.join(__dirname, `../vault/clients/${clientName}/scrolls/webhook-audit.md`);
const outputPath = path.join(__dirname, `../exports/${clientName}-audit.${format}`);

if (!fs.existsSync(scrollPath)) {
  console.error('❌ Scroll not found.');
  process.exit(1);
}

if (format === 'md') {
  fs.copyFileSync(scrollPath, outputPath);
  console.log(`📦 Exported scroll to ${outputPath}`);
} else if (format === 'pdf') {
  console.log('⚠️ PDF export not implemented yet.');
} else {
  console.error('❌ Invalid format. Use md or pdf.');
}