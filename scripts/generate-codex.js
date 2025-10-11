import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const weekRange = args.find(arg => arg.startsWith('--weeks='))?.split('=')[1] || '1-7';
const dropRange = args.find(arg => arg.startsWith('--drops='))?.split('=')[1] || '1-7';

const [weekStart, weekEnd] = weekRange.split('-').map(Number);
const [dropStart, dropEnd] = dropRange.split('-').map(Number);

const codexPath = path.join(__dirname, '../src/pages/codex');
const indexPath = path.join(codexPath, 'index.json');

// Load existing index
let index = [];
if (fs.existsSync(indexPath)) {
  index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
}

// Track new entries
const newIndex = [];

for (let week = weekStart; week <= weekEnd; week++) {
  const weekFolder = path.join(codexPath, `week-${String(week).padStart(2, '0')}`);
  if (!fs.existsSync(weekFolder)) fs.mkdirSync(weekFolder, { recursive: true });

  const drops = [];

  for (let drop = dropStart; drop <= dropEnd; drop++) {
    const filePath = path.join(weekFolder, `drop-${drop}.json`);
    if (!fs.existsSync(filePath)) {
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

    drops.push({
      id: drop,
      path: `week-${String(week).padStart(2, '0')}/drop-${drop}.json`,
      title: `Week ${week} · Drop ${drop}`
    });
  }

  // Update index entry
  const existingWeek = index.find(w => w.week === week);
  if (existingWeek) {
    const existingDropIds = new Set(existingWeek.drops.map(d => d.id));
    const mergedDrops = [...existingWeek.drops];
    for (const d of drops) {
      if (!existingDropIds.has(d.id)) mergedDrops.push(d);
    }
    existingWeek.drops = mergedDrops;
  } else {
    newIndex.push({ week, drops });
  }
}

// Merge new weeks into index
index = [...index, ...newIndex];

// Sort index by week
index.sort((a, b) => a.week - b.week);

// Write updated index
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
console.log(`\n✅ Codex scaffold complete: Weeks ${weekStart}-${weekEnd} × Drops ${dropStart}-${dropEnd}`);
console.log(`✅ index.json updated`);