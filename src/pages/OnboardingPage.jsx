import React from 'react';
import { Helmet } from 'react-helmet-async';
import CTAButton from '@/components/ui/CTAButton';

const OnboardingPage = () => {
  return (
    <div className="onboarding bg-black text-white min-h-screen px-6 py-12">
      <Helmet>
        <title>Onboarding — Vauntico</title>
        <meta name="description" content="Begin your Vauntico journey. Set intentions, align your systems, and start your ascent." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main" className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-vauntico-gold mb-4">Begin Your Journey</h1>
          <p className="text-xl text-gray-300 mb-8">
            Set intentions, align your systems, and start your ascent to legacy-grade creation.
          </p>
        </header>
        
        <section className="bg-gray-900 p-8 rounded-lg mb-8 hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="step-1">
          <h2 id="step-1" className="text-2xl font-semibold text-vauntico-gold mb-4">Step 1: Set Your Intention</h2>
          <p className="text-gray-300 mb-6">
            Every sacred journey begins with clarity. What legacy do you want to build?
          </p>
          <button
            onClick={() => console.log('Intention setting clicked')}
            data-cta="onboarding-set-intention"
            aria-label="Set your intention for the Vauntico journey"
            className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            Set Intention
          </button>
        </section>
        
        <section className="bg-gray-900 p-8 rounded-lg mb-8 hover:bg-gray-800 transition-colors duration-300" role="region" aria-labelledby="step-2">
          <h2 id="step-2" className="text-2xl font-semibold text-vauntico-gold mb-4">Step 2: Choose Your Path</h2>
          <p className="text-gray-300 mb-6">
            Select the creator path that aligns with your vision and goals.
          </p>
          <button
            onClick={() => console.log('Path selection clicked')}
            data-cta="onboarding-choose-path"
            aria-label="Choose your creator path"
            className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-200"
          >
            Choose Path
          </button>
        </section>
        
        <div className="text-center mt-12">
          <CTAButton
            to="/onboarding-step"
            trackEvent="onboarding_click_begin_journey"
            data-cta="onboarding-begin-journey-main"
            label="Begin Your Sacred Journey"
            aria-label="Begin your complete Vauntico journey"
            className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
          >
            Begin Journey
          </CTAButton>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
