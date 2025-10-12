import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SignedOut } from '@clerk/clerk-react'

export default function RitesPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <Helmet>
        <title>Rites — Vauntico</title>
        <meta name="description" content="Dream Mover’s nave: CLI Veil and React Loom. Explore integration paths and try a dry-run." />
        <link rel="canonical" href="https://www.vauntico.com/rites" />
      </Helmet>

      <main className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Rites</h1>
        <p className="text-gray-400 mb-8">Explore Dream Mover: CLI Veil, React Loom. Invoke the Flame’s Dry-Run with UTM runes.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <a href="/vault?utm_source=rites&utm_medium=card&utm_campaign=dry_run" className="block border border-gray-800 rounded p-6 hover:bg-gray-900 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-2">Invoke the Flame’s Dry-Run</h2>
            <p className="text-gray-400">Preview the migration flow. Entitlements unlock full power.</p>
            <SignedOut>
              <div className="mt-3 text-xs text-gray-400">Sign in to invoke the full rite →</div>
            </SignedOut>
          </a>
          <a href="/vault?utm_source=rites&utm_medium=card&utm_campaign=cli_veil" className="block border border-gray-800 rounded p-6 hover:bg-gray-900 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-2">CLI Veil</h2>
            <p className="text-gray-400">Command-line rituals. Automate your ascent.</p>
            <SignedOut>
              <div className="mt-3 text-xs text-gray-400">Sign in to invoke the full rite →</div>
            </SignedOut>
          </a>
          <a href="/vault?utm_source=rites&utm_medium=card&utm_campaign=react_loom" className="block border border-gray-800 rounded p-6 hover:bg-gray-900 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-2">React Loom</h2>
            <p className="text-gray-400">Embed previews in your web flows. Try gated widgets.</p>
            <SignedOut>
              <div className="mt-3 text-xs text-gray-400">Sign in to invoke the full rite →</div>
            </SignedOut>
          </a>
        </div>
      </main>
    </div>
  )
}
