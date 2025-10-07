import fs from "fs";
import path from "path";

// CONFIG: how many weeks and days you want
const TOTAL_WEEKS = 7;   // adjust as needed
const DAYS_PER_WEEK = 7; // adjust as needed

// Base directory for codex
const baseDir = path.join(process.cwd(), "src/pages/codex");

// Ensure base directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Build index.json structure
const index = {};

for (let w = 1; w <= TOTAL_WEEKS; w++) {
  const weekKey = `week-${String(w).padStart(2, "0")}`;
  const weekDir = path.join(baseDir, weekKey);

  if (!fs.existsSync(weekDir)) {
    fs.mkdirSync(weekDir, { recursive: true });
  }

  index[weekKey] = [];

  for (let d = 1; d <= DAYS_PER_WEEK; d++) {
    const dayKey = `day-${String(d).padStart(2, "0")}`;
    index[weekKey].push(dayKey);

    const filePath = path.join(weekDir, `${dayKey}.json`);

    if (!fs.existsSync(filePath)) {
      const placeholder = {
        title: `Transmission — ${weekKey} / ${dayKey}`,
        subtitle: "A fragment of the Codex",
        body: "<<< Insert Vauntico voice here >>>"
      };
      fs.writeFileSync(filePath, JSON.stringify(placeholder, null, 2));
    }
  }
}

// Write index.json
fs.writeFileSync(
  path.join(baseDir, "index.json"),
  JSON.stringify(index, null, 2)
);

console.log(`✅ Codex scaffold generated: ${TOTAL_WEEKS} weeks × ${DAYS_PER_WEEK} days`);