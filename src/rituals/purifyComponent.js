// src/rituals/purifyComponent.js
import { readFile, writeFile, appendFile } from "../utils/fileAccess.js";
import { invokeCopilot } from "../utils/copilot.js";
import { execSync } from "child_process";
import path from "path";

export async function purifyComponent(filePath) {
  const content = readFile(filePath);
  if (!content) {
    console.error("❌ Failed to read:", filePath);
    return;
  }

  const response = await invokeCopilot({
    prompt: `Purify this JSX component and narrate its arc.`,
    context: content,
  });

  console.log("🧾 Copilot Response:\n", response.message);

  // Append scroll to lore
  const scrollEntry = `\n---\n### ${path.basename(filePath)}\n${response.message}\n`;
  appendFile("lore/purification-scroll.md", scrollEntry);

  // Write purified file if needed
  if (response.code) {
    const purifiedPath = filePath.replace(".jsx", ".purified.jsx");
    writeFile(purifiedPath, response.code);
    console.log(`✅ Purified version written to: ${purifiedPath}`);

    // Stage for commit
    execSync(`git add ${purifiedPath}`);
  }
}