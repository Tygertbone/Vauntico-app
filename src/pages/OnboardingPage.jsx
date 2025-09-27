import React from 'react';
import CTAButton from '@/components/ui/CTAButton';

const OnboardingPage = () => {
  return (
    <div className="onboarding">
      <CTAButton
        to="/onboarding-step"
        trackEvent="onboarding_cta_click"
        label="Begin Journey"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Begin Journey
      </CTAButton>
    </div>
  );
};

export default OnboardingPage;
