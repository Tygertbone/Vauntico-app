#!/usr/bin/env node
const { execSync } = require("child_process");

try {
  console.log("🧠 Running CI Enforcement Agent (PR polish check)…");
  execSync('echo "Review latest PR diff. If CTA props or hover polish are missing, comment with branded enforcement message." | cursor -', { stdio: "inherit" });
} catch (err) {
  console.warn("⚠️ CI Enforcement Agent failed or credits exhausted. Skipping PR comment.");
}