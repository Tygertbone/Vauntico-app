import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function WebhookStudioPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <Helmet>
        <title>Vauntico Webhook Studio — Verify with Clarity</title>
        <meta name="description" content="CLI-first webhook verification with live admin dashboard and CI integration." />
        <link rel="canonical" href="https://www.vauntico.com/webhook-studio" />
      </Helmet>

      <main className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Vauntico Webhook Studio</h1>
          <p className="text-gray-300">CLI toolkit + Admin dashboard + CI checks — a clean ritual for verification.</p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="border border-gray-800 rounded p-6 bg-gradient-to-b from-gray-900 to-black">
            <h2 className="text-2xl font-semibold mb-3">CLI Toolkit</h2>
            <p className="text-gray-400 mb-4">Simulate events, run end-to-end tests, and initialize local env — all from your terminal.</p>
            <pre className="bg-gray-900 border border-gray-800 rounded p-3 text-xs overflow-auto">
{`# Dry-run (signed, no POST)
vauntico-webhook simulate --url $WEBHOOK_URL \
  --email you@example.com --plan seekers-spark --amount 199 --dry-run

# Send events
vauntico-webhook simulate --url $WEBHOOK_URL --email you@example.com --plan seekers-spark --amount 199
vauntico-webhook disable  --url $WEBHOOK_URL --event subscription.disable --email you@example.com --plan seekers-spark

# Full test
vauntico-webhook test --webhook $WEBHOOK_URL`}
            </pre>
          </div>
          <div className="border border-gray-800 rounded p-6 bg-gradient-to-b from-gray-900 to-black">
            <h2 className="text-2xl font-semibold mb-3">Admin Dashboard</h2>
            <p className="text-gray-400 mb-4">View webhook logs with filters and payloads. Clerk-gated for internal ops.</p>
            <a href="/admin/webhook-log" className="inline-block bg-yellow-400 text-black px-5 py-3 rounded font-semibold hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">Open Webhook Logs →</a>
          </div>
        </section>

        <section className="border border-gray-800 rounded p-6 bg-gray-950 mb-12">
          <h3 className="text-xl font-semibold mb-3">Docs & Resources</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><a className="underline" href="https://github.com/Tygertbone/Vauntico-app/tree/main/cli" target="_blank" rel="noreferrer">CLI README</a></li>
            <li><a className="underline" href="https://github.com/Tygertbone/Vauntico-app/tree/main/db/migrations" target="_blank" rel="noreferrer">Supabase RLS & Migrations</a></li>
            <li><a className="underline" href="/api/admin/webhook-logs?event=charge.success&page=1&pageSize=50" target="_blank" rel="noreferrer">Admin API (sample query)</a></li>
          </ul>
        </section>

        <footer className="text-center text-xs text-gray-500 mt-12">
          Built to Teach. Designed to Last.
        </footer>
      </main>
    </div>
  )
}
