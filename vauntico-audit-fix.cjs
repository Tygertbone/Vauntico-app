#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Audit rules
const AUDIT_RULES = {
  ctaProps: ['label', 'to', 'trackEvent'],
  hoverEffects: ['hover:scale-', 'hover:shadow-', 'transition-'],
  brandingClasses: ['vauntico-gold', 'vauntico-dark'],
  importPaths: ['@/components/ui/', '../components/ui/']
};

const FILES_TO_AUDIT = [
  { path: "src/pages/Homepage.jsx", critical: true },
  { path: "src/pages/OnboardingPage.jsx", critical: true },
  { path: "src/pages/PricingPage.jsx", critical: true },
  { path: "src/pages/VaultDetailPage.jsx", critical: false },
  { path: "src/pages/DemoPage.jsx", critical: false },
  { path: "src/pages/DelegationPage.jsx", critical: false },
  { path: "src/components/ui/CTAButton.jsx", critical: true },
  { path: "src/components/VaultCard.jsx", critical: true },
  { path: "src/components/PricingTable.jsx", critical: true }
];

let auditResults = {
  totalFiles: 0,
  passedFiles: 0,
  failedFiles: 0,
  issues: [],
  fixes: []
};

function auditFile(filePath, isCritical = false) {
  const fullPath = path.resolve(filePath);
  auditResults.totalFiles++;

  if (!fs.existsSync(fullPath)) {
    auditResults.issues.push({
      file: filePath,
      type: 'MISSING_FILE',
      severity: isCritical ? 'CRITICAL' : 'HIGH',
      message: `File does not exist`,
      fix: `Create ${filePath} with proper CTA component structure`
    });
    auditResults.failedFiles++;
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  const fileIssues = [];

  // Import path check
  if (content.includes('import CTAButton') || content.includes('<CTAButton')) {
    if (!content.includes("@/components/ui/CTAButton")) {
      fileIssues.push({
        type: 'WRONG_IMPORT_PATH',
        severity: 'HIGH',
        message: 'CTAButton import should use @/components/ui/ path',
        line: findLineNumber(content, 'import.*CTAButton'),
        fix: `import CTAButton from '@/components/ui/CTAButton';`
      });
    }
  }

  // CTA props check
  const ctaUsages = findCTAUsages(content);
  ctaUsages.forEach(usage => {
    AUDIT_RULES.ctaProps.forEach(prop => {
      if (!usage.props.includes(prop)) {
        fileIssues.push({
          type: 'MISSING_CTA_PROP',
          severity: prop === 'trackEvent' ? 'MEDIUM' : 'HIGH',
          message: `CTA missing required prop: ${prop}`,
          line: usage.line,
          fix: `Add ${prop}="${prop === 'trackEvent' ? 'your_event_name' : 'your_value'}" to CTAButton`
        });
      }
    });
  });

  // Hover polish check
  if ((content.includes('<button') || content.includes('<CTAButton')) && !AUDIT_RULES.hoverEffects.some(e => content.includes(e))) {
    fileIssues.push({
      type: 'MISSING_HOVER_POLISH',
      severity: 'MEDIUM',
      message: 'Interactive elements missing Vauntico hover standards',
      fix: 'Add hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300'
    });
  }

  // Branding consistency
  if (content.includes('#D4AF37') || content.includes('yellow-400')) {
    if (!content.includes('vauntico-gold')) {
      fileIssues.push({
        type: 'BRANDING_VIOLATION',
        severity: 'LOW',
        message: 'Using hardcoded colors instead of brand variables',
        fix: 'Replace hardcoded colors with vauntico-gold, vauntico-dark variables'
      });
    }
  }

  if (fileIssues.length === 0) {
    auditResults.passedFiles++;
  } else {
    auditResults.failedFiles++;
    fileIssues.forEach(issue => {
      auditResults.issues.push({ file: filePath, ...issue });
    });
  }
}

function findLineNumber(content, pattern) {
  const lines = content.split('\n');
  const regex = new RegExp(pattern);
  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) return i + 1;
  }
  return 1;
}

function findCTAUsages(content) {
  const usages = [];
  const ctaRegex = /<CTAButton([^>]*)>/g;
  let match;
  while ((match = ctaRegex.exec(content)) !== null) {
    usages.push({
      props: match[1],
      line: findLineNumber(content, '<CTAButton')
    });
  }
  return usages;
}

function generateFixScript() {
  return `#!/usr/bin/env node
// Auto-generated fix script for Vauntico audit issues

const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/pages/PricingPage.jsx',
    find: "import CTAButton from '../components/CTAButton';",
    replace: "import CTAButton from '@/components/ui/CTAButton';"
  },
  {
    file: 'src/pages/VaultDetailPage.jsx',
    find: "import CTAButton from '../components/CTAButton';",
    replace: "import CTAButton from '@/components/ui/CTAButton';"
  },
  {
    file: 'src/pages/OnboardingPage.jsx',
    find: '<CTAButton label="Start Your Sprint" to="/vault-success"',
    replace: '<CTAButton label="Start Your Sprint" to="/vault-success" trackEvent="sprint_start"'
  }
];

fixes.forEach(fix => {
  const filePath = path.resolve(fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(\`✅ Fixed \${fix.file}\`);
    }
  }
});

console.log('🎯 Auto-fixes complete!');
`;
}

// Run audit
console.log('🔍 Running Vauntico Brand Audit...\n');
FILES_TO_AUDIT.forEach(({ path: filePath, critical }) => auditFile(filePath, critical));

// Summary
console.log('\n📊 AUDIT SUMMARY');
console.log('================');
console.log(`Total files audited: ${auditResults.totalFiles}`);
console.log(`Passed: ${auditResults.passedFiles}`);
console.log(`Failed: ${auditResults.failedFiles}`);
console.log(`Total issues found: ${auditResults.issues.length}`);

// Severity breakdown
const criticalIssues = auditResults.issues.filter(i => i.severity === 'CRITICAL');
const highIssues = auditResults.issues.filter(i => i.severity === 'HIGH');
const mediumIssues = auditResults.issues.filter(i => i.severity === 'MEDIUM');

if (criticalIssues.length > 0) {
  console.log('\n🚨 CRITICAL ISSUES (Must fix immediately):');
  criticalIssues.forEach(issue => {
    console.log(`  - ${issue.file}: ${issue.message}`);
    console.log(`    Fix: ${issue.fix}\n`);
  });
}

if (highIssues.length > 0) {
  console.log('\n⚠️ HIGH PRIORITY ISSUES:');
  highIssues.forEach(issue => {
    console.log(`  - ${issue.file}: ${issue.message}`);
    console.log(`    Fix: ${issue.fix}\n`);
  });
}

if (mediumIssues.length > 0) {
  console.log('\n📋 MEDIUM PRIORITY ISSUES:');
  mediumIssues.forEach(issue => {
    console.log(`  - ${issue.file}: ${issue.message}`);
    console.log(`    Fix: ${issue.fix}\n`);
  });
}

// Generate auto-fix script
if (auditResults.issues.length > 0) {
  const fixScript = generateFixScript();
  fs.writeFileSync('vauntico-auto-fix.cjs', fixScript);
  console.log('🔧 Generated vauntico-auto-fix.cjs - run this to apply automatic fixes');
}

// Exit codes
if (criticalIssues.length > 0) {
  console.log('\n❌ AUDIT FAILED - Critical issues must be resolved');
  process.exit(1);
} else if (highIssues.length > 0) {
  console.log('\n⚠️ AUDIT WARNING - High priority issues found');
  process.exit(0);
} else {
  console.log('\n✅ AUDIT PASSED - All Vauntico standards met');
  process.exit(0);
}