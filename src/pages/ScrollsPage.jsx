import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function ScrollsPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <Helmet>
        <title>Scrolls — Vauntico</title>
        <meta name="description" content="Toggle grimoire modes: plain vs. poetic. Explore the Vauntico knowledge scrolls." />
        <link rel="canonical" href="https://www.vauntico.com/scrolls" />
      </Helmet>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Scrolls</h1>
        <p className="text-gray-400 mb-4">Choose your reading mode:</p>
        <ul className="list-disc list-inside text-gray-300">
          <li>Plain: Direct technical guidance.</li>
          <li>Poetic: Lyrical invocations for the inspired.</li>
        </ul>
      </main>
    </div>
  )
}
