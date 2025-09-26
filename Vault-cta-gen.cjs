#!/usr/bin/env node
const { execSync } = require("child_process");

const vaultName = process.argv[2];

if (!vaultName) {
  console.error("❌ Please provide a vault name. Example: node vault-cta-gen.cjs creator-pass");
  process.exit(1);
}

const task = `Generate branded CTA for ${vaultName} vault. Include label, to, trackEvent, and hover polish.`;

try {
  console.log(`🧠 Generating CTA for vault: ${vaultName}…`);
  execSync(`echo "${task}" | cursor -`, { stdio: "inherit" });
} catch (err) {
  console.warn("⚠️ Cursor Agent failed or credits exhausted. Skipping CTA generation.");
}