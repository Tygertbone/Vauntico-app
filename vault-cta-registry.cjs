#!/usr/bin/env node
const { execSync } = require("child_process");

const vaults = ["creator-pass", "legacy-vault", "founder-vault", "rebirth-vault"];

vaults.forEach((vault) => {
  const task = `Generate branded CTA for ${vault} vault. Include label, to, trackEvent, and hover polish.`;
  try {
    console.log(`🧠 Generating CTA for vault: ${vault}…`);
    execSync(`echo "${task}" | cursor -`, { stdio: "inherit" });
  } catch (err) {
    console.warn(`⚠️ CTA generation failed for ${vault}. Skipping.`);
  }
});