import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const VaultDetailPage = () => {
  return (
    <div className="vault-detail">
      <CTAButton
        to="/vault-details"
        trackEvent="vault_cta_click"
        label="Access Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Access Vault
      </CTAButton>
    </div>
  );
};

export default VaultDetailPage;
