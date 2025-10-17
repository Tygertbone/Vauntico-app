import { invokeCopilot } from "../src/utils/copilot.js";

(async () => {
  const response = await invokeCopilot({
    prompt: "Validate this Codex drop and narrate its arc.",
    context: {
      title: "The First Glyph",
      body: "Today we begin the transmission.",
    },
  });

  console.log("🧾 Copilot Response:", response.message);
})();