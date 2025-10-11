#!/usr/bin/env node
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
      console.log(`✅ Fixed ${fix.file}`);
    }
  }
});

console.log('🎯 Auto-fixes complete!');
