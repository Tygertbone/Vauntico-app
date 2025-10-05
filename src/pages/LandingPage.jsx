import React from 'react';
import '@/styles/landing.css'; // Optional: for custom styles
import CTAButton from '@/components/ui/CTAButton';

const LandingPage = () => {
  return (
    <div className="landing-page bg-gradient-to-br from-vauntico-dark via-black to-gray-900 text-white min-h-screen">
      {/* 🧠 Hero Section */}
      <section className="hero-section py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 text-vauntico-gold drop-shadow-md">
          The Conscious Coder’s Conversion Kit
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Built by Vauntico to turn clarity into legacy.
        </p>

        <ul className="text-left max-w-xl mx-auto mb-8 list-disc list-inside text-lg text-gray-200">
          <li className="mb-2">BankID RB-2025-001 — Automate spiritual alignment with branded flows</li>
          <li>BankID RB-2025-002 — Convert clarity into traceable impact</li>
        </ul>

        <CTAButton
          to="/checkout"
          label="Get Started"
          trackEvent="landing_click_cta"
          className="bg-vauntico-gold text-black font-semibold px-6 py-3 rounded hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
        >
          Get Started
        </CTAButton>

        <footer className="mt-12 text-xs text-gray-500 text-center">
          Ethical Footer: This section was generated with traceable intent, spiritual clarity, and legacy alignment.
        </footer>
      </section>
    </div>
  );
};

export default LandingPage;
  </footer>
</section>C:\Users\admin\.ollama\id_ed2551