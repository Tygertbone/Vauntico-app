import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const VaultCard = () => {
  return (
    <div className="vault-card">
      <CTAButton
        to="/vault-access"
        trackEvent="vaultcard_click_unlock_vault"
        label="Unlock Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Unlock Vault
      </CTAButton>
    </div>
  );
};

export default VaultCard;
