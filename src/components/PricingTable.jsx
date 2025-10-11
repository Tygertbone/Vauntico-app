import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const PricingTable = () => {
  return (
    <div className="pricing-table space-y-6" role="table" aria-label="Vauntico Pricing Plans">
      <div className="pricing-row bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-vauntico-gold hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold text-vauntico-gold mb-4" role="columnheader">Starter Plan</h3>
        <p className="text-gray-300 mb-6">Perfect for getting started with Vauntico</p>
        <CTAButton 
          onClick={() => console.log('Starter plan selected')}
          data-cta="pricing-starter-select"
          aria-label="Select Starter Plan"
          className="hover:bg-vauntico-gold hover:text-black transition-colors duration-200"
        >
          Get Started
        </CTAButton>
      </div>
      
      <div className="pricing-row bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-vauntico-gold hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold text-vauntico-gold mb-4" role="columnheader">Premium Plan</h3>
        <p className="text-gray-300 mb-6">Full access to all Vauntico features</p>
        <CTAButton 
          onClick={() => console.log('Premium plan selected')}
          data-cta="pricing-premium-select"
          aria-label="Select Premium Plan"
          className="hover:bg-vauntico-gold hover:text-black transition-colors duration-200"
        >
          Go Premium
        </CTAButton>
      </div>
    </div>
  );
};

export default PricingTable;
