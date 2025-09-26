import { Link } from "react-router-dom";
import VaultCard from "../components/VaultCard";
import CTAButton from "@/components/ui/CTAButton";
import PlanCTA from "@/components/ui/PlanCTA"; // ✅ Added for branded CTA

export default function Homepage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-vauntico-gold">Awaken. Build. Transcend.</h1>
        <p className="mt-4 text-lg text-gray-300">Vauntico is where ideas become income.</p>
        {/* ✅ Replace static button with branded CTA */}
        <PlanCTA
          planId="creator-pass"
          label="Get Your Creator Pass"
          promoCode="VAUNT25"
          className="mt-6"
        />
      </header>

      <section className="grid md:grid-cols-2 gap-6 mb-16">
        {/* ...unchanged vault links... */}
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-24">
        {/* ...unchanged VaultCard components... */}
      </section>

      {/* Email Capture Section */}
      <div className="mt-24 px-6">
        <h2 className="text-3xl font-bold text-vauntico-gold mb-4 text-center">
          Join the Vauntico Movement
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          Get early access to new vaults, creator tools, and exclusive drops.
        </p>
        <form
          name="vauntico-email-capture"
          method="POST"
          data-netlify="true"
          className="max-w-xl mx-auto"
        >
          <input type="hidden" name="form-name" value="vauntico-email-capture" />
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded bg-white text-black border border-vauntico-gold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vauntico-gold"
          />
          <button
            type="submit"
            className="mt-4 bg-vauntico-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition w-full"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}