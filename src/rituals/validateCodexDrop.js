// src/rituals/validateCodexDrop.js
import { readFile } from "../utils/fileAccess.js";
import { invokeCopilot } from "../utils/copilot.js";

export async function validateCodexDrop(week, day) {
  const path = `src/pages/codex/${week}/${day}.json`;
  const content = readFile(path);

  if (!content) {
    console.error("❌ Codex drop not found:", path);
    return;
  }

  const response = await invokeCopilot({
    prompt: `Validate this Codex drop and narrate its arc.`,
    context: content,
  });

  console.log("🧾 Copilot Response:", response.message);
  if (response.code) {
    console.log("🔧 Suggested Fix:", response.code);
  }
}