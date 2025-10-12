import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SignIn, SignUp } from '@clerk/clerk-react'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <Helmet>
        <title>Account — Vauntico</title>
        <meta name="description" content="Sign in or create your Vauntico account to link your rites and unlock the Vault." />
        <link rel="canonical" href="https://www.vauntico.com/account" />
      </Helmet>

      <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <section className="border border-gray-800 rounded p-6">
          <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
          <SignIn routing="path" signUpUrl="/account#signup" afterSignInUrl="/link-rites" />
        </section>
        <section className="border border-gray-800 rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Create account</h2>
          <SignUp routing="path" signInUrl="/account" afterSignUpUrl="/link-rites" />
        </section>
      </main>
    </div>
  )
}
