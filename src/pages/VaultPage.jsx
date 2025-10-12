import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import PaystackButton from '@/components/PaystackButton'
import { ENTITLEMENTS_MAP } from '@/utils/entitlements'

export default function VaultPage() {
  const [email, setEmail] = useState('')

  const plans = [
    { key: 'seekers-spark', name: "Seeker's Spark", priceZAR: 199, blurb: 'Entry to the Vault. Founders essentials.' },
    { key: 'weavers-pyre', name: "Weaver's Pyre", priceZAR: 499, blurb: 'Serious builders. Advanced flows.' },
    { key: 'eternal-blaze', name: 'Eternal Blaze', priceZAR: 999, blurb: 'All-access. Priority support. Elite ops.' },
  ]

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <Helmet>
        <title>Vault — Vauntico</title>
        <meta name="description" content="Unlock the Vauntico Vault. Local ZAR billing via Paystack. Plans: Seeker's Spark, Weaver's Pyre, Eternal Blaze." />
        <link rel="canonical" href="https://www.vauntico.com/vault" />
      </Helmet>

      <main role="main" className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Unlock the Vault</h1>
          <p className="text-gray-400">Billing handled locally via Paystack (ZAR). Stripe coming soon when the LLC rises.</p>
        </header>

        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="vault-email" className="block text-sm text-gray-300 mb-2">Email for receipts and access</label>
          <input
            id="vault-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded bg-gray-900 border border-gray-700"
          />
        </div>

        <section className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.key} className="border border-gray-800 rounded-lg p-6 bg-gradient-to-b from-gray-900 to-black">
              <h2 className="text-2xl font-semibold mb-2">{p.name}</h2>
              <p className="text-gray-400 mb-4">{p.blurb}</p>
              <div className="text-3xl font-bold text-yellow-400 mb-6">R{p.priceZAR}<span className="text-sm text-gray-400">/mo</span></div>

              <PaystackButton
                amount={p.priceZAR}
                email={email}
                className="w-full bg-yellow-400 text-black font-semibold px-4 py-3 rounded"
              >
                Start R{p.priceZAR}/mo via Paystack
              </PaystackButton>

              <p className="mt-3 text-xs text-gray-500">Dream Mover entitlement: {ENTITLEMENTS_MAP[p.key].dreamMoverTier}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 text-center text-sm text-gray-500">
          <p>Note: Stripe support will be added when the LLC is available.</p>
        </section>
      </main>
    </div>
  )
}
