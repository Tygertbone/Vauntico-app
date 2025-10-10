import React from 'react';
import { Helmet } from 'react-helmet';
import CTAButton from '@/components/ui/CTAButton';

const VaultDetailPage = () => {
  return (
    <div className="vault-detail bg-black text-white min-h-screen px-6 py-12">
      <Helmet>
        <title>Vault Details — Vauntico</title>
        <meta name="description" content="Explore a Vauntico vault: curated prompts, workflows, and assets designed for spiritual-tech creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <main role="main" className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vauntico-gold mb-4">Creator's Toolkit Vault</h1>
          <p className="text-xl text-gray-300 mb-8">
            Premium prompts, workflows, and assets for content creators and influencers.
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <section role="region" aria-labelledby="vault-preview">
            <h2 id="vault-preview" className="text-2xl font-semibold text-vauntico-gold mb-6">Vault Preview</h2>
            <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors duration-300">
              <p className="text-gray-300 mb-4">
                Get a glimpse of the powerful tools and templates inside this sacred vault.
              </p>
              <button
                onClick={() => console.log('Preview clicked')}
                data-cta="vault-detail-preview"
                aria-label="Preview the vault contents"
                className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-200 w-full"
              >
                Preview Contents
              </button>
            </div>
          </section>
          
          <section role="region" aria-labelledby="vault-contents">
            <h2 id="vault-contents" className="text-2xl font-semibold text-vauntico-gold mb-6">What's Inside</h2>
            <ul className="space-y-3 text-gray-300" role="list">
              <li role="listitem" className="flex items-center">
                <span className="text-vauntico-gold mr-3">✦</span>
                50+ Premium Content Creation Prompts
              </li>
              <li role="listitem" className="flex items-center">
                <span className="text-vauntico-gold mr-3">✦</span>
                Social Media Strategy Templates
              </li>
              <li role="listitem" className="flex items-center">
                <span className="text-vauntico-gold mr-3">✦</span>
                Brand Voice Development Guides
              </li>
              <li role="listitem" className="flex items-center">
                <span className="text-vauntico-gold mr-3">✦</span>
                Engagement Optimization Workflows
              </li>
            </ul>
          </section>
        </div>
        
        <div className="text-center bg-gray-900 p-8 rounded-lg">
          <h3 className="text-2xl font-semibold text-vauntico-gold mb-4">Ready to Transform Your Content?</h3>
          <p className="text-gray-300 mb-8">
            Join thousands of creators who've elevated their craft with Vauntico's sacred tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => console.log('Learn more clicked')}
              data-cta="vault-detail-learn-more"
              aria-label="Learn more about this vault"
              className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Learn More
            </button>
            
            <CTAButton
              to="/vault-details"
              trackEvent="vaultdetail_click_access_vault"
              data-cta="vault-detail-access-main"
              label="Access Sacred Vault"
              aria-label="Access the complete vault contents"
              className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
            >
              Access Vault
            </CTAButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VaultDetailPage;
