// vauntico-final-audit-fix.cjs
const fs = require('fs');
const path = require('path');

const patches = [
  {
    file: 'src/pages/OnboardingPage.jsx',
    content: `import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const OnboardingPage = () => {
  return (
    <div className="onboarding">
      <CTAButton
        to="/onboarding-step"
        trackEvent="onboarding_cta_click"
        label="Begin Journey"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
      >
        Begin Journey
      </CTAButton>
    </div>
  );
};

export default OnboardingPage;
`,
  },
  {
    file: 'src/pages/PricingPage.jsx',
    content: `import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const PricingPage = () => {
  return (
    <div className="pricing-page">
      <section className="pricing-intro">
        <h1 className="text-4xl font-bold mb-6">Choose Your Legacy Tier</h1>
        <CTAButton
          to="/pricing-details"
          trackEvent="pricing_cta_click"
          label="View Plans"
          className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
        >
          View Plans
        </CTAButton>
      </section>

      <section className="premium-offer mt-12">
        <h2 className="text-2xl font-semibold mb-4">Vauntico Premium</h2>
        <p className="mb-6">Unlock full access to branded automation, spiritual empowerment, and legacy-grade tooling.</p>
        <CTAButton
          to="/checkout"
          trackEvent="pricing_cta_click"
          label="Upgrade Now"
          className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
        >
          Upgrade Now
        </CTAButton>
      </section>

      <section className="faq mt-16">
        <h3 className="text-xl font-medium mb-4">Need Help Choosing?</h3>
        <CTAButton
          to="/contact"
          trackEvent="pricing_cta_click"
          label="Talk to Us"
          className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
        >
          Talk to Us
        </CTAButton>
      </section>
    </div>
  );
};

export default PricingPage;
`,
  },
  {
    file: 'src/pages/VaultDetailPage.jsx',
    content: `import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const VaultDetailPage = () => {
  return (
    <div className="vault-detail">
      <CTAButton
        to="/vault-details"
        trackEvent="vault_cta_click"
        label="Access Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
      >
        Access Vault
      </CTAButton>
    </div>
  );
};

export default VaultDetailPage;
`,
  },
  {
    file: 'src/components/VaultCard.jsx',
    content: `import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const VaultCard = () => {
  return (
    <div className="vault-card">
      <CTAButton
        to="/vault-access"
        trackEvent="vault_card_cta_click"
        label="Unlock Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
      >
        Unlock Vault
      </CTAButton>
    </div>
  );
};

export default VaultCard;
`,
  },
];

patches.forEach(({ file, content }) => {
  const filePath = path.resolve(process.cwd(), file);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Patched ${file}`);
});

console.log('\n🚀 Final audit fixes applied. Run `npm run audit` to confirm full pass.');