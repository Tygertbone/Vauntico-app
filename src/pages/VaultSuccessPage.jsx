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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-vauntico-gold mb-6">Vault Unlocked ✅</h1>
          <p className="text-gray-300 mb-4">
            You now have access to premium templates, workflows, and brand assets.
          </p>
          <p className="text-gray-400 mb-8 italic">
            This is your edge. Use it wisely.
          </p>

          <Link
            to="/creator-pass"
            className="inline-block bg-yellow-400 text-black px-6 py-3 rounded border border-vauntico-gold hover:bg-vauntico-gold transition font-semibold shadow-md hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
          >
            Get the Full Creator Pass →
          </Link>

          <div className="mt-8">
            <Link to="/" className="text-gray-400 underline hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
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
      className="mt-4 bg-vauntico-gold text-black px-6 py-3 rounded font-semibold hover:bg-yellow-400 transition w-full hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
      Subscribe
    </button>
  </form>
</div>
    </SidebarInset>
  );
}