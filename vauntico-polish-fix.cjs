#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('✨ Applying Vauntico polish and prop fixes...\n');

const fixes = [
  // Add hover polish to Homepage
  {
    file: 'src/pages/Homepage.jsx',
    find: 'className="cta-section"',
    replace: 'className="cta-section vauntico-hover"'
  },

  // Add hover polish to OnboardingPage
  {
    file: 'src/pages/OnboardingPage.jsx',
    find: 'className="w-full"',
    replace: 'className="w-full vauntico-hover"'
  },

  // Add hover polish to VaultDetailPage
  {
    file: 'src/pages/VaultDetailPage.jsx',
    find: 'className="vault-cta"',
    replace: 'className="vault-cta vauntico-hover"'
  },

  // Add trackEvent to VaultCard CTA
  {
    file: 'src/components/VaultCard.jsx',
    find: 'label={`Unlock ${title}`}',
    replace: 'label={`Unlock ${title}`} trackEvent={`vault_card_${slug}`}'
  },

  // Add hover polish to VaultCard
  {
    file: 'src/components/VaultCard.jsx',
    find: 'className="w-full"',
    replace: 'className="w-full vauntico-hover"'
  }
];

fixes.forEach(fix => {
  const filePath = path.resolve(fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Patched ${fix.file}`);
    } else {
      console.log(`⚠️ Pattern not found in ${fix.file}, skipping...`);
    }
  } else {
    console.log(`⚠️ ${fix.file} not found, skipping...`);
  }
});

console.log('\n🎯 Vauntico polish fixes complete!');
console.log('Next steps:');
console.log('1. Run `npm run audit` to confirm all issues are resolved');
console.log('2. Test hover polish and CTA tracking across all pages');
console.log('3. Commit and push your changes to staging\n');