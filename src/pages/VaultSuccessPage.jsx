import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SidebarInset } from '../components/ui/sidebar';

export default function VaultSuccessPage() {
  return (
    <SidebarInset>
      <div className="bg-black text-white min-h-screen px-6 py-12">
        <Helmet>
          <title>Vault Unlocked — Vauntico</title>
          <meta name="description" content="Success. Your Vauntico vault is unlocked. Access premium templates and workflows to accelerate your ascent." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <main role="main" className="max-w-3xl mx-auto text-center">
          <header>
            <h1 className="text-4xl font-bold text-vauntico-gold mb-6">Vault Unlocked ✅</h1>
            <p className="text-gray-300 mb-4">
              You now have access to premium templates, workflows, and brand assets.
            </p>
            <p className="text-gray-400 mb-8 italic">
              This is your edge. Use it wisely.
            </p>
          </header>

          <section className="mb-8" role="region" aria-labelledby="next-steps">
            <h2 id="next-steps" className="sr-only">Next Steps</h2>
            <Link
              to="/creator-pass"
              data-cta="vault-success-creator-pass"
              aria-label="Upgrade to the full Creator Pass for complete access"
              className="inline-block bg-yellow-400 text-black px-6 py-3 rounded border border-vauntico-gold hover:bg-vauntico-gold transition font-semibold shadow-md hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
            >
              Get the Full Creator Pass →
            </Link>
          </section>

          <nav aria-label="Return navigation">
            <Link 
              to="/" 
              data-cta="vault-success-back-home"
              aria-label="Return to Vauntico homepage"
              className="text-gray-400 underline hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
            >
              Back to Homepage
            </Link>
          </nav>
        </main>
      </div>
        <div className="mt-24 px-6" role="region" aria-labelledby="email-capture-title">
          <h2 id="email-capture-title" className="text-3xl font-bold text-vauntico-gold mb-4 text-center">
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
            aria-labelledby="email-capture-title"
          >
            <input type="hidden" name="form-name" value="vauntico-email-capture" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              aria-label="Your email address for exclusive Vauntico updates"
              required
              className="w-full px-4 py-3 rounded bg-white text-black border border-vauntico-gold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-vauntico-gold"
            />
            <button
              type="submit"
              data-cta="vault-success-email-subscribe"
              aria-label="Subscribe to exclusive Vauntico updates and early access"
              className="mt-4 bg-vauntico-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition w-full hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
              Subscribe
            </button>
          </form>
        </div>
    </SidebarInset>
  );
}