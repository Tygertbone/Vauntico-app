import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI args
const args = process.argv.slice(2);
const weekRange = args.find(arg => arg.startsWith('--weeks='))?.split('=')[1] || '1-7';
const dropRange = args.find(arg => arg.startsWith('--drops='))?.split('=')[1] || '1-7';

const [weekStart, weekEnd] = weekRange.split('-').map(Number);
const [dropStart, dropEnd] = dropRange.split('-').map(Number);

const codexPath = path.join(__dirname, '../src/pages/codex');

for (let week = weekStart; week <= weekEnd; week++) {
  const weekFolder = path.join(codexPath, `week-${String(week).padStart(2, '0')}`);
  if (!fs.existsSync(weekFolder)) fs.mkdirSync(weekFolder, { recursive: true });

  for (let drop = dropStart; drop <= dropEnd; drop++) {
    const filePath = path.join(weekFolder, `drop-${drop}.json`);
    if (fs.existsSync(filePath)) continue;

    const transmission = {
      title: `Week ${week} · Drop ${drop}`,
      body: [
        "This is a placeholder transmission.",
        "Replace with real content when ready."
      ]
    };

    fs.writeFileSync(filePath, JSON.stringify(transmission, null, 2));
    console.log(`✅ Created: week-${week}/drop-${drop}.json`);
  }
}

console.log(`\n✅ Codex scaffold complete: Weeks ${weekStart}-${weekEnd} × Drops ${dropStart}-${dropEnd}`);