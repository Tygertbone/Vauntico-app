const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const filesToAudit = [
  "src/components/ui/CTAButton.jsx",
  "src/components/ui/VaultCTA.jsx",
  "src/components/ui/PlanCTA.jsx",
  "src/pages/Homepage.jsx",
  "src/pages/OnboardingPage.jsx",
  "src/components/PricingTable.jsx"
];

let failed = false;

filesToAudit.forEach((filePath) => {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");

  const missingProps = [];
  if (!content.includes("CTAButton")) missingProps.push("CTAButton");
  if (!content.includes("label=")) missingProps.push("label");
  if (!content.includes("to=")) missingProps.push("to");
  if (!content.includes("trackEvent")) missingProps.push("trackEvent");

  if (missingProps.length > 0) {
    console.error(`❌ ${filePath} is missing: ${missingProps.join(", ")}`);
    failed = true;
  }
});

if (failed) {
  console.error("🚫 CTA audit failed. Fix issues before committing.");
}

// 🧠 Cursor CLI integration (lean mode via stdin)
try {
  console.log("🧠 Running Cursor Agent (lean mode via stdin)…");
  execSync('echo "Audit CTA props in Homepage.jsx" | cursor -', { stdio: "inherit" });
} catch (err) {
  console.warn("⚠️ Cursor Agent failed or credits exhausted. Skipping automated polish.");
}

if (failed) {
  process.exit(1);
} else {
  console.log("✅ All CTA components pass audit.");
}