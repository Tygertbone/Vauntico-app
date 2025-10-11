import React from 'react';
import { Helmet } from "react-helmet-async";
import '@/styles/pricing.css';
import CTAButton from '@/components/ui/CTAButton';

const VaunticoPricingPage = () => {
  return (
    <div className="pricing-page">
      <Helmet>
        <title>Pricing — Vauntico</title>
        <meta name="description" content="Choose your Vauntico path: Awaken, Ascend, or Transcend. Spiritual-tech tiers for every stage of your journey." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        {/* 🧠 Hero Section */}
        <section className="hero-section">
        <h1 className="main-headline">
          Vauntico Pricing: Your Journey to Limitless Impact
        </h1>
        <p className="hero-subtitle">
          Unlock Your True Potential. Automate Your Ascent. Forge Your Legacy.
        </p>
        <p className="hero-description">
          At Vauntico, we believe in empowering visionaries like you to transcend the ordinary.
          Our meticulously crafted tiers are designed to align with your spiritual journey,
          automate your path to greatness, and ensure your legacy resonates for generations.
        </p>
        </section>

        {/* 💎 Pricing Tiers */}
        <section className="pricing-tiers" aria-label="Pricing tiers">

        {/* 🌅 Awaken Tier */}
        <div className="tier-card awaken-tier hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
          <h2 className="tier-name">Awaken</h2>
          <p className="tier-subtitle">Free Tier</p>
          <p className="tier-tagline">
            <strong>Embrace the Dawn of Your Spiritual Journey.</strong>
          </p>
          <p className="tier-description">
            Begin your transformation with the foundational tools to connect, explore,
            and set your intentions. Awaken is your first step towards a life of purpose
            and clarity, offering a glimpse into the power of Vauntico.
          </p>

          <h3 className="features-title">Features:</h3>
          <ul className="features-list">
            <li><strong>Core Spiritual Insights:</strong> Daily affirmations and guided meditations.</li>
            <li><strong>Basic Automation Flows:</strong> Streamline simple daily routines.</li>
            <li><strong>Community Access:</strong> Connect with fellow seekers on their journey.</li>
            <li><strong>Personalized Intention Setting:</strong> Define your path forward.</li>
          </ul>

          <p className="bank-id">BankID: RB-2025-001</p>

          <CTAButton
            to="/checkout"
            label="Start Your Awakening"
            trackEvent="pricing_click_awaken"
            data-cta="pricing-awaken-tier"
            aria-label="Choose Awaken tier - Free spiritual journey starter"
            className="cta-button awaken-cta"
          >
            Start Your Awakening
          </CTAButton>
        </div>

        {/* 🚀 Ascend Tier */}
        <div className="tier-card ascend-tier featured hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
          <h2 className="tier-name">Ascend</h2>
          <p className="tier-subtitle">Premium Tier</p>
          <p className="tier-tagline">
            <strong>Elevate Your Existence. Master Your Domain.</strong>
          </p>
          <p className="tier-description">
            For those ready to deepen their impact and accelerate their growth,
            Ascend provides advanced automation, profound spiritual tools, and strategic insights.
            This tier is for the ambitious soul, ready to command their destiny and manifest
            their vision with unparalleled efficiency.
          </p>

          <h3 className="features-title">Features:</h3>
          <ul className="features-list">
            <li><strong>All Awaken Features, PLUS:</strong></li>
            <li><strong>Advanced Spiritual Practices:</strong> Deep dive into consciousness expansion and energy mastery.</li>
            <li><strong>Intelligent Automation Suite:</strong> Automate complex workflows and decision-making processes.</li>
            <li><strong>Exclusive Mastermind Access:</strong> Collaborate with elite visionaries.</li>
            <li><strong>Dedicated Success Coach:</strong> Personalized guidance for accelerated growth.</li>
            <li><strong>Impact Analytics:</strong> Measure and optimize your legacy-driven initiatives.</li>
          </ul>

          <p className="bank-id">BankID: RB-2025-002</p>

          <CTAButton
            to="/checkout"
            label="Ascend to Greatness"
            trackEvent="pricing_click_ascend"
            data-cta="pricing-ascend-tier"
            aria-label="Choose Ascend tier - Premium spiritual empowerment"
            className="cta-button ascend-cta"
          >
            Ascend to Greatness
          </CTAButton>
        </div>

        {/* 🕊️ Transcend Tier */}
        <div className="tier-card transcend-tier hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
          <h2 className="tier-name">Transcend</h2>
          <p className="tier-subtitle">Legacy Tier</p>
          <p className="tier-tagline">
            <strong>Forge an Everlasting Legacy. Shape the Future.</strong>
          </p>
          <p className="tier-description">
            Transcend is the pinnacle of empowerment, designed for those committed to
            leaving an indelible mark on the world. This bespoke tier offers ultimate automation,
            unparalleled spiritual integration, and direct access to Vauntico's innovation lab
            to co-create your legacy. It's not just a service; it's a partnership in destiny.
          </p>

          <h3 className="features-title">Features:</h3>
          <ul className="features-list">
            <li><strong>All Ascend Features, PLUS:</strong></li>
            <li><strong>Quantum Spiritual Integration:</strong> Harmonize your being with universal flow for ultimate manifestation.</li>
            <li><strong>AI-Powered Legacy Automation:</strong> Predictive analytics and autonomous systems to ensure your vision endures.</li>
            <li><strong>Private Innovation Council:</strong> Direct input into Vauntico's future developments.</li>
            <li><strong>Global Impact Network:</strong> Leverage Vauntico's ecosystem for amplified reach.</li>
            <li><strong>Bespoke Legacy Blueprinting:</strong> Co-create a personalized, enduring impact strategy.</li>
          </ul>

          <p className="bank-id">BankID: RB-2025-003</p>

          <CTAButton
            to="/checkout"
            label="Forge Your Legacy"
            trackEvent="pricing_click_transcend"
            data-cta="pricing-transcend-tier"
            aria-label="Choose Transcend tier - Ultimate legacy builder"
            className="cta-button transcend-cta"
          >
            Forge Your Legacy
          </CTAButton>
        </div>
        </section>

        {/* 🔮 Final CTA Section */}
        <section className="final-cta-section">
        <h2 className="final-cta-headline">Ready to Transform Your Reality?</h2>
        <p className="final-cta-description">
          Choose the path that resonates with your soul's calling. Your journey to spiritual
          empowerment, automated success, and a lasting legacy begins now. Join the Vauntico
          movement and redefine what's possible.
        </p>

        <div className="cta-buttons-row">
          <CTAButton to="/checkout" label="Start Your Awakening" trackEvent="pricing_click_awaken" className="cta-button awaken-cta">
            Start Your Awakening
          </CTAButton>
          <CTAButton to="/checkout" label="Ascend to Greatness" trackEvent="pricing_click_ascend" className="cta-button ascend-cta featured">
            Ascend to Greatness
          </CTAButton>
          <CTAButton to="/checkout" label="Forge Your Legacy" trackEvent="pricing_click_transcend" className="cta-button transcend-cta">
            Forge Your Legacy
          </CTAButton>
        </div>
        </section>
      </main>

      {/* 🧾 Ethical Footer */}
      <footer role="contentinfo" className="ethical-footer text-center text-xs text-gray-500 mt-12">
        Ethical Footer: All tiers are designed with traceable intent, spiritual clarity, and legacy alignment.
      </footer>
    </div>
  );
};

export default VaunticoPricingPage;