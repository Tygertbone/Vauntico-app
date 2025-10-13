import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import VaultCard from "../components/VaultCard";
import CTAButton from "@/components/ui/CTAButton";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Terminal } from "lucide-react";

export default function Homepage() {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-14 md:py-16">
      <Helmet>
        <title>Vauntico — Awaken. Build. Transcend.</title>
        <meta
          name="description"
          content="Vauntico helps creators and founders turn clarity into income with branded flows, vaults, and spiritual-tech polish."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <main role="main">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-5xl md:text-6xl leading-tight font-extrabold text-[var(--vauntico-gold-text)]">
            Vauntico: Build with Ritual. Scale with Clarity.
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
            From CLI to cosmos — empower your team with tools that teach, verify, and glow.
          </p>
          <div className="mt-7 md:mt-8 flex items-center justify-center gap-3">
            <Link to="/dream-mover" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
              Launch Dream Mover
            </Link>
            <Link to="/webhook-studio" className="bg-gray-900 text-white border border-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300">
              Explore Webhook Studio
            </Link>
          </div>

          {/* ✅ Featured Ascension Codex Banner */}
          <div className="mt-8 max-w-3xl mx-auto">
            {/* 🔗 Updated to go straight to today's transmission */}
            <Link 
              to="/codex/today"
              data-cta="homepage-ascension-codex-banner"
              aria-label="Begin your ascension with today's transmission"
            >
              <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-[var(--vauntico-gold)] p-8 rounded-xl border-2 border-[var(--vauntico-gold)] hover:scale-105 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-vauntico-glow">
                <Badge className="mb-4 bg-[var(--vauntico-gold)] text-black px-3 py-1">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  NEW RELEASE
                </Badge>
                <h2 className="text-3xl font-bold mb-3 text-white">
                  The Ascension Codex
                </h2>
                <p className="text-lg text-gray-200 mb-4">
                  Your Daily Transmission from the Infinite
                </p>
                <p className="text-gray-300 mb-6">
                  AI-powered spiritual growth sequences for founders & creators.
                  Personalized wisdom delivered daily. From $9/month.
                </p>
                <div className="flex items-center justify-center gap-2 text-[var(--vauntico-gold-text)] font-semibold">
                  <Crown className="w-5 h-5" />
                  <span>Begin Your Ascension →</span>
                </div>
              </div>
            </Link>

            {/* ✅ NEW: Archive Button */}
            <div className="mt-4 text-center">
              <Link
                to="/codex/archive"
                data-cta="homepage-codex-archive"
                aria-label="View the complete Codex archive"
                className="inline-block px-6 py-3 rounded bg-gray-900 hover:bg-gray-800 text-[var(--vauntico-gold-text)] font-semibold transition"
              >
                View Codex Archive
              </Link>
            </div>
          </div>

          {/* Original CTA */}
          <div className="mt-6">
            <CTAButton
              label="Get Your Creator Pass"
              to="/creator-pass"
              trackEvent="home_click_creator_pass"
              className="mt-6"
            />
          </div>
        </header>

        {/* Dual Columns: Dream Mover & Webhook Studio */}
        <section className="grid md:grid-cols-2 gap-6 mb-16 md:mb-20" aria-label="Products">
          <Link
            to="/dream-mover"
            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition block"
          >
            <h3 className="text-2xl font-bold text-vauntico-gold mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5" /> Dream Mover</h3>
            <p className="text-gray-300 mb-3">Ritualized onboarding console for safe migrations and live ops.</p>
            <span className="text-yellow-400 underline">Launch Console →</span>
          </Link>
          <Link
            to="/webhook-studio"
            className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition block"
          >
            <h3 className="text-2xl font-bold text-vauntico-gold mb-2 flex items-center gap-2"><Terminal className="w-5 h-5" /> Webhook Studio</h3>
            <p className="text-gray-300 mb-3">CLI toolkit, admin dashboard, and CI integration for verifiable flows.</p>
            <span className="text-yellow-400 underline">Explore Studio →</span>
          </Link>
        </section>

        {/* Live Previews */}
        <section className="grid md:grid-cols-3 gap-6 mb-16 md:mb-20" aria-label="Live Previews">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Badge Preview</h3>
            <p className="text-gray-400 mb-3">View your current tier and status.</p>
            <Link to="/link-rites" className="text-yellow-400 underline">Open /link-rites →</Link>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Webhook Logs</h3>
            <p className="text-gray-400 mb-3">Admin-only dashboard for recent events.</p>
            <Link to="/admin/webhook-log" className="text-yellow-400 underline">Open logs →</Link>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">CLI Snippets</h3>
            <pre className="bg-black/40 border border-gray-800 rounded p-3 text-xs overflow-auto">{`vauntico-webhook simulate --url $WEBHOOK_URL \
  --email you@example.com --plan seekers-spark --amount 199\nvauntico-webhook disable --url $WEBHOOK_URL --event subscription.disable --email you@example.com --plan seekers-spark\nvauntico-webhook test --webhook $WEBHOOK_URL`}</pre>
          </div>
        </section>

        {/* Docs & Resources */}
        <section className="bg-gray-950 border border-gray-800 rounded p-6 md:p-8 mb-20" aria-label="Docs & Resources">
          <h3 className="text-xl font-semibold mb-3">Docs & Resources</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><a className="underline" href="https://github.com/Tygertbone/Vauntico-app/tree/main/cli" target="_blank" rel="noreferrer">CLI README</a></li>
            <li><a className="underline" href="https://github.com/Tygertbone/Vauntico-app/tree/main/db/migrations" target="_blank" rel="noreferrer">Supabase RLS Guide & Migrations</a></li>
            <li><a className="underline" href="/api/admin/webhook-logs?event=charge.success&page=1&pageSize=50" target="_blank" rel="noreferrer">Admin API — /api/admin/webhook-logs</a></li>
          </ul>
        </section>
            title="Creator's Toolkit"
            price="$49"
            description="Essential prompts for content creators and influencers"
            buttonText="Coming Soon"
          />
          <VaultCard
            title="Agency Arsenal"
            price="$99"
            description="Professional workflows for marketing agencies"
            buttonText="Coming Soon"
          />
          <VaultCard
            title="E-commerce Empire"
            price="$149"
            description="Product descriptions and branding for online stores"
            buttonText="Coming Soon"
          />
        </section>

      </main>
      <footer role="contentinfo" className="text-center text-xs text-gray-500 mt-12 py-8 border-t border-gray-800">
        <div className="mb-2">Built to Teach. Designed to Last.</div>
        <nav className="flex items-center justify-center gap-4">
          <a href="https://github.com/Tygertbone/Vauntico-app" className="underline" target="_blank" rel="noreferrer">GitHub</a>
          <a href="/webhook-studio" className="underline">Docs</a>
          <a href="mailto:support@vauntico.com" className="underline">Contact</a>
          <a href="/privacy" className="underline">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}