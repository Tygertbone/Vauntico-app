// vauntico-lint.cjs
const fs = require('fs');
const path = require('path');

const CTA_REGEX = /<CTAButton([^>]*)>/g;
const HOVER_REGEX = /hover:scale-\[1\.02\].*hover:shadow-vauntico-glow.*transition-all.*duration-300/;
const IMPORT_REGEX = /import CTAButton from ['"]([^'"]+)['"]/;

const requiredProps = ['label', 'to', 'trackEvent'];
const requiredHover = 'hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300';
const correctImport = '@/components/ui/CTAButton';

const scanFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Check CTAButton props
  const matches = [...content.matchAll(CTA_REGEX)];
  matches.forEach((match, i) => {
    const props = match[1];
    requiredProps.forEach((prop) => {
      if (!props.includes(`${prop}=`)) {
        issues.push(`❌ Missing prop '${prop}' on CTAButton #${i + 1}`);
      }
    });
  });

  // Check hover polish only if file has interactive elements
  const hasInteractiveElements = /<button|<a href|<CTAButton|<PlanCTA|<VaultCTA/.test(content);
  if (hasInteractiveElements && !HOVER_REGEX.test(content)) {
    issues.push(`⚠️ Missing Vauntico hover polish on interactive elements`);
  }

  // Check import path
  const importMatch = content.match(IMPORT_REGEX);
  if (importMatch && importMatch[1] !== correctImport) {
    issues.push(`⚠️ Incorrect CTAButton import path: ${importMatch[1]}`);
  }

  return issues;
};

const walkDir = (dir) => {
  const results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (file.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
};

const jsxFiles = walkDir(path.resolve(process.cwd(), 'src'));
let totalIssues = 0;

console.log('🔍 Running vauntico-lint...\n');

jsxFiles.forEach((file) => {
  const issues = scanFile(file);
  if (issues.length > 0) {
    console.log(`📄 ${file}`);
    issues.forEach((issue) => console.log(`   ${issue}`));
    totalIssues += issues.length;
  }
});

if (totalIssues === 0) {
  console.log('\n✅ All files pass Vauntico lint standards.');
} else {
  console.log(`\n🚨 ${totalIssues} issues found across ${jsxFiles.length} files.`);
}