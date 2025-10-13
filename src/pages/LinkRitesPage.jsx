import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { Link } from 'react-router-dom'
import LottieFromUrl from '@/components/LottieFromUrl'

export default function LinkRitesPage() {
  const { isLoaded, user } = useUser()
  const [entitlement, setEntitlement] = useState(null)
  const [loading, setLoading] = useState(true)

  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || null

  useEffect(() => {
    async function fetchEntitlement() {
      const supa = getSupabaseClient()
      if (!supa || (!user?.id && !email)) {
        setLoading(false)
        return
      }
      const { data, error } = await supa
        .from('entitlements')
        .select('tier,status')
        .or(`clerk_user_id.eq.${user?.id},email.eq.${email || ''}`)
        .maybeSingle()
      if (!error && data) setEntitlement(data)
      setLoading(false)
    }
    if (isLoaded) fetchEntitlement()
  }, [isLoaded, user?.id, email])

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
          {!isLoaded || loading ? (
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
                {entitlement ? (
                  <div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-gray-300">Tier: <span className="font-semibold">{entitlement.tier}</span></p>
                        <p className="text-gray-400 text-sm">Status: {entitlement.status}</p>
                      </div>
                      {(entitlement.status?.toLowerCase?.().includes('success') || entitlement.status === 'active' || entitlement.status === 'granted') && (
                        <LottieFromUrl src="/brand-assets/badgeglow.json" loop autoplay className="w-24 h-24" />
                      )}
                    </div>
                    {entitlement.tier === 'seekers-spark' && (
                      <div className="mt-2 text-xs text-gray-400">rune: seekers-spark</div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">No active entitlements detected yet. Complete a pledge in the Vault to unlock.</p>
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
