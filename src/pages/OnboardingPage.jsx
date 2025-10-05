import React from 'react';
import { Helmet } from 'react-helmet';
import CTAButton from '@/components/ui/CTAButton';

const OnboardingPage = () => {
  return (
    <div className="onboarding">
      <Helmet>
        <title>Onboarding — Vauntico</title>
        <meta name="description" content="Begin your Vauntico journey. Set intentions, align your systems, and start your ascent." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        <h1 className="sr-only">Begin Your Journey</h1>
        <CTAButton
        to="/onboarding-step"
          trackEvent="onboarding_click_begin_journey"
        label="Begin Journey"
        className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
        Begin Journey
        </CTAButton>
      </main>
    </div>
  );
};

export default OnboardingPage;
