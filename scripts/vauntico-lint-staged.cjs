#!/usr/bin/env node
// scripts/vauntico-lint-staged.cjs
// Scans only staged files passed as argv for Vauntico UI standards

const fs = require('fs');
const path = require('path');

const CTA_REGEX = /<CTAButton([^>]*)>/g;
const HOVER_REGEX = /hover:scale-\[1\.02\].*hover:shadow-vauntico-glow.*transition-all.*duration-300/;
const IMPORT_REGEX = /import CTAButton from ['"]([^'"]+)['"]/;

const requiredProps = ['label', 'to', 'trackEvent'];
const correctImport = '@/components/ui/CTAButton';

const scanContent = (content, fileLabel) => {
  const issues = [];

  const matches = [...content.matchAll(CTA_REGEX)];
  matches.forEach((match, i) => {
    const props = match[1] || '';
    requiredProps.forEach((prop) => {
      if (!props.includes(`${prop}=`)) {
        issues.push(`❌ Missing prop '${prop}' on CTAButton #${i + 1}`);
      }
    });
  });

  const hasInteractiveElements = /<button|<a href|<CTAButton|<PlanCTA|<VaultCTA/.test(content);
  if (hasInteractiveElements && !HOVER_REGEX.test(content)) {
    issues.push(`⚠️ Missing Vauntico hover polish on interactive elements`);
  }

  const importMatch = content.match(IMPORT_REGEX);
  if (importMatch && importMatch[1] !== correctImport) {
    issues.push(`⚠️ Incorrect CTAButton import path: ${importMatch[1]}`);
  }

  if (issues.length > 0) {
    console.log(`\n📄 ${fileLabel}`);
    issues.forEach((issue) => console.log(`   ${issue}`));
  }
  return issues.length;
};

const main = async () => {
  const files = process.argv.slice(2).filter((f) => /\.(jsx?|tsx?)$/.test(f));
  if (files.length === 0) {
    // Nothing to check
    process.exit(0);
  }

  console.log('🔍 Running vauntico-lint on staged files...');
  let totalIssues = 0;

  for (const f of files) {
    try {
      if (!fs.existsSync(f)) continue;
      const content = fs.readFileSync(f, 'utf8');
      totalIssues += scanContent(content, path.resolve(f));
    } catch (e) {
      console.error(`Error reading ${f}:`, e.message);
      totalIssues++;
    }
  }

  if (totalIssues === 0) {
    console.log('\n✅ Staged files pass Vauntico lint standards.');
    process.exit(0);
  } else {
    console.log(`\n🚨 ${totalIssues} issues found in staged files.`);
    // Non-zero exit to block commit
    process.exit(1);
  }
};

main();
