#!/usr/bin/env node
const { execSync } = require("child_process");

const runAgent = (label, command) => {
  try {
    console.log(`\n🧠 ${label}`);
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    console.warn(`⚠️ ${label} failed or credits exhausted. Skipping.`);
  }
};

// 1. Vault CTA Registry Generator
const vaults = ["creator-pass", "legacy-vault", "founder-vault", "rebirth-vault"];
vaults.forEach((vault) => {
  const task = `Generate branded CTA for ${vault} vault. Include label, to, trackEvent, and hover polish.`;
  runAgent(`Generating CTA for vault: ${vault}`, `echo "${task}" | cursor -`);
});

// 2. Hover Audit Agent
runAgent(
  "Running Hover Audit Agent (Vauntico motion standards)",
  `echo "Audit all components for missing hover polish. Enforce Vauntico standards: glow, scale, smooth transitions." | cursor -`
);

// 3. CI Enforcement Agent
runAgent(
  "Running CI Enforcement Agent (PR polish check)",
  `echo "Review latest PR diff. If CTA props or hover polish are missing, comment with branded enforcement message." | cursor -`
);

console.log("\n✅ Vauntico enforcement suite complete.");