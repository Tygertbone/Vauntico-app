import React from 'react';
import { Helmet } from 'react-helmet';
import CTAButton from '@/components/ui/CTAButton';

const VaultDetailPage = () => {
  return (
    <div className="vault-detail">
      <Helmet>
        <title>Vault Details — Vauntico</title>
        <meta name="description" content="Explore a Vauntico vault: curated prompts, workflows, and assets designed for spiritual-tech creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <CTAButton
        to="/vault-details"
        trackEvent="vaultdetail_click_access_vault"
        label="Access Vault"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Access Vault
      </CTAButton>
    </div>
  );
};

export default VaultDetailPage;
