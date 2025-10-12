import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function DreamMoverBridgePage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <Helmet>
        <title>Dream Mover — Bridge</title>
        <meta name="description" content="Bridge page carrying identity context to Dream Mover." />
        <link rel="canonical" href="https://www.vauntico.com/dream-mover" />
      </Helmet>

      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dream Mover Bridge</h1>
        <p className="text-gray-400">This is a placeholder route. It can forward context to the Dream Mover app.</p>
      </main>
    </div>
  )
}
