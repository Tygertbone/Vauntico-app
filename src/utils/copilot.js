// src/utils/copilot.js

export async function invokeCopilot({ prompt, context }) {
  const isCodex = prompt.includes("Validate this Codex drop");
  const parsed = isCodex && typeof context === "string" ? JSON.parse(context) : context;

  // Codex drop validation
  if (isCodex) {
    const { title, body } = parsed;
    const issues = [];

    if (!title || title.trim() === "") issues.push("Missing title.");
    if (!body || !Array.isArray(body) || body.length < 2) {
      issues.push("Body must be an array with at least 2 entries.");
    } else {
      body.forEach((line, i) => {
        if (typeof line !== "string" || line.trim() === "") {
          issues.push(`Body line ${i + 1} is empty or invalid.`);
        }
      });
    }

    if (issues.length) {
      return {
        message: `❌ Codex drop has issues:\n- ${issues.join("\n- ")}`,
        code: null,
      };
    }

    const scroll = [
      `📜 ${title}`,
      ...body.map((line) => `> ${line}`),
      `🧬 Lines: ${body.length}`,
      `✅ Codex drop is structurally valid.`,
    ].join("\n");

    return {
      message: scroll,
      code: null,
    };
  }

  // JSX purification
  if (prompt.includes("Purify this JSX component")) {
    const lines = context.split("\n");
    const issues = [];
    let codeFix = null;

    if (!context.includes("import React")) {
      issues.push("Missing React import.");
      codeFix = `import React from 'react';\n` + context;
    }

    if (!context.includes("export default")) {
      issues.push("Missing default export.");
      if (!codeFix) codeFix = context + `\n\nexport default ComponentName;`;
    }

    const hasReturn = lines.some((line) => line.includes("return ("));
    if (!hasReturn) {
      issues.push("Missing \`return\` statement in component.");
    }

    const hasAria = context.includes("aria-");
    const hasClassName = context.includes("className=");

    const scroll = [
      `🧼 JSX Purification Scroll`,
      `Lines: ${lines.length}`,
      hasAria ? "✅ Accessibility attributes detected." : "⚠️ No ARIA attributes found.",
      hasClassName ? "✅ Tailwind or className usage detected." : "⚠️ No className usage found.",
      issues.length
        ? `❌ Structural issues:\n- ${issues.join("\n- ")}`
        : "✅ Component structure appears valid.",
    ].join("\n");

    return {
      message: scroll,
      code: codeFix,
    };
  }

  // Default fallback
  return {
    message: `🧠 Ritual received: "${prompt}". No validation logic matched.`,
    code: null,
  };
}