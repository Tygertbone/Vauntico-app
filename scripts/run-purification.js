// scripts/run-purification.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { purifyComponent } from "../src/rituals/purifyComponent.js";

const COMPONENT_DIR = "src/components";

function getJSXFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".jsx"))
    .map((file) => path.join(dir, file));
}

(async () => {
  const files = getJSXFiles(COMPONENT_DIR);

  if (files.length === 0) {
    console.log("❌ No JSX files found in:", COMPONENT_DIR);
    return;
  }

  console.log(`🔍 Found ${files.length} JSX files. Beginning purification...`);

  for (const file of files) {
    console.log(`\n🧼 Purifying: ${file}`);
    await purifyComponent(file);
  }

  console.log("\n✅ All components purified.");

  // Lore commit block
  const timestamp = new Date().toISOString().split("T")[0];
  execSync(`git add lore/purification-scroll.md`);
  execSync(`git commit -m "🧼 JSX Purification · Scroll sealed on ${timestamp}"`);
  console.log(`\n📜 Commit complete: JSX purification scroll sealed.`);
})();