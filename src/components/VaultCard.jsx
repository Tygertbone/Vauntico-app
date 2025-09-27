import React from 'react';
import CTAButton from '@/components/ui/CTAButton';;

const VaultCard = () => {
  return (
    <div className="vault-card">
      <CTAButton
        to="/vault-access"
        trackEvent="vault_card_cta_click"
        label="Unlock Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
       className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Unlock Vault
      </CTAButton>
    </div>
  );
};

export default VaultCard;
