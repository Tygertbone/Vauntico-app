import React from 'react';
import { Helmet } from 'react-helmet-async';
import '@/styles/landing.css'; // Optional: for custom styles
import '@/styles/reveal.css';
import { setupReveal } from '@/utils/reveal';
import CTAButton from '@/components/ui/CTAButton';

const LandingPage = () => {
  React.useEffect(() => { setupReveal(); }, []);

  return (
    <div className="landing-page bg-gradient-to-br from-vauntico-dark via-black to-gray-900 text-white min-h-screen">
      <Helmet>
        <title>Vauntico Landing — Conscious Coder’s Conversion Kit</title>
        <meta name="description" content="Build with intention. Vauntico’s landing system showcases branded flows that turn clarity into legacy." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        {/* 🧠 Hero Section */}
        <section className="hero-section py-20 px-6 text-center" data-reveal>
          <div className="space-y-2">
            <h1 className="text-5xl font-bold mb-2 text-vauntico-gold drop-shadow-md">
              The Conscious Coder’s Conversion Kit
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Built by Vauntico to turn clarity into legacy. <span className="text-xs text-gray-400">[BankID: RB-2025-001, RB-2025-002]</span>
            </p>
          </div>

          <ul className="text-left max-w-xl mx-auto mb-8 list-disc list-inside text-lg text-gray-200" data-reveal>
            <li className="mb-2">BankID RB-2025-001 — Automate spiritual alignment with branded flows</li>
            <li>BankID RB-2025-002 — Convert clarity into traceable impact</li>
          </ul>

          <CTAButton
            to="/checkout"
            label="Get Started"
            trackEvent="landing_click_get_started"
            data-cta="landing-hero-get-started"
            aria-label="Get started with Vauntico's conscious coder conversion kit"
            className="bg-vauntico-gold text-black font-semibold px-6 py-3 rounded hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
          >
            Get Started
          </CTAButton>
        </section>
      </main>
      <footer role="contentinfo" className="mt-12 text-xs text-gray-500 text-center px-6 pb-8">
        Ethical Footer: This section was generated with traceable intent, spiritual clarity, and legacy alignment.
      </footer>
    </div>
  );
};

export default LandingPage;
