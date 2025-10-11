import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const VaultCard = ({ title, price, description, buttonText, onClick }) => {
  return (
    <div 
      className="vault-card bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-vauntico-gold hover:shadow-lg transition-all duration-300"
      role="article"
      aria-labelledby={`vault-title-${title?.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {title && (
        <h3 
          id={`vault-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xl font-semibold text-vauntico-gold mb-2"
        >
          {title}
        </h3>
      )}
      {price && (
        <div className="text-2xl font-bold text-white mb-3" aria-label={`Price: ${price}`}>
          {price}
        </div>
      )}
      {description && (
        <p className="text-gray-300 mb-6">{description}</p>
      )}
      <CTAButton
        to="/vault-access"
        onClick={onClick}
        trackEvent="vaultcard_click_unlock_vault"
        data-cta={`vault-${title?.replace(/\s+/g, '-').toLowerCase()}-unlock`}
        label={buttonText || "Unlock Vault"}
        aria-label={`${buttonText || "Unlock Vault"} - ${title}`}
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300 w-full"
      >
        {buttonText || "Unlock Vault"}
      </CTAButton>
    </div>
  );
};

export default VaultCard;
