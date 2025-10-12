import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import useEntitlements from '@/store/entitlements'
import { Link } from 'react-router-dom'

export default function LinkRitesPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const entitlements = useEntitlements((s) => s.entitlements)

  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || null
  const userEntitlement = email ? entitlements[email] : null

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <Helmet>
        <title>Link Rites — Vauntico</title>
        <meta name="description" content="Link your Vauntico account to Dream Mover entitlements and cross the altar." />
        <link rel="canonical" href="https://www.vauntico.com/link-rites" />
      </Helmet>

      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Link Rites</h1>

        <SignedOut>
          <p className="text-gray-400 mb-4">You need to sign in to link your rites.</p>
          <Link to="/account" className="underline hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">Go to Account →</Link>
        </SignedOut>

        <SignedIn>
          {!isLoaded ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-6">
              <div className="border border-gray-800 rounded p-6">
                <h2 className="text-xl font-semibold mb-2">Your Identity</h2>
                <p className="text-gray-300">{user?.fullName || 'Adept'}</p>
                <p className="text-gray-500 text-sm">{email || 'no email'}</p>
              </div>

              <div className="border border-gray-800 rounded p-6">
                <h2 className="text-xl font-semibold mb-2">Entitlement</h2>
                {userEntitlement ? (
                  <div>
                    <p className="text-gray-300">Tier: <span className="font-semibold">{userEntitlement.tier}</span></p>
                    <p className="text-gray-400 text-sm">Status: {userEntitlement.status}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">No active entitlements detected. Complete a pledge in the Vault to unlock.</p>
                )}
              </div>

              <div className="border border-gray-800 rounded p-6">
                <h2 className="text-xl font-semibold mb-2">Cross to Dream Mover</h2>
                <Link
                  to={`/dream-mover?userId=${encodeURIComponent(user?.id || '')}`}
                  className="inline-block bg-yellow-400 text-black px-5 py-3 rounded font-semibold hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
                >
                  Proceed →
                </Link>
              </div>
            </div>
          )}
        </SignedIn>
      </main>
    </div>
  )
}
