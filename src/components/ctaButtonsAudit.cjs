const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "CTAButton.jsx");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) return console.error("❌ Error reading CTAButton.jsx:", err);

  const hasOnClick = data.includes("onClick");
  const hasVaultRef = /vault|pass|checkout|trigger|navigate|router/.test(data);
  const hasEnv = data.includes("process.env");
  const hasAriaLabel = data.includes("aria-label");
  const hasTracking = /track|analytics|event|log/.test(data);
  const hasDynamicImport = data.includes("import(");
  const hasSlot = data.includes("data-slot=");
  const hasGradient = /bg-gradient|from-|to-/.test(data);
  const hasHoverEffect = /hover:|transition/.test(data);

  console.log("\n🔍 Vauntico CTA Audit Results:");
  console.log(hasOnClick ? "✅ Has onClick handler." : "⚠️ No onClick detected.");
  console.log(hasVaultRef ? "✅ References vault/pass/checkout logic." : "⚠️ No vault-related logic found.");
  console.log(hasEnv ? "✅ Uses environment variables." : "⚠️ No .env usage detected.");
  console.log(hasAriaLabel ? "✅ Accessibility label present." : "⚠️ Missing aria-label.");
  console.log(hasTracking ? "✅ Tracking logic present." : "⚠️ No tracking detected.");
  console.log(hasDynamicImport ? "✅ Uses dynamic import." : "⚠️ No dynamic import detected.");
  console.log(hasSlot ? "✅ Slot structure present." : "⚠️ Missing data-slot attributes.");
  console.log(hasGradient ? "✅ Gradient styling detected." : "⚠️ No gradient styling found.");
  console.log(hasHoverEffect ? "✅ Hover/transition effects present." : "⚠️ No hover/transition styling.");
});