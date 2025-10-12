import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function HearthPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-16">
      <Helmet>
        <title>Hearth — Vauntico</title>
        <meta name="description" content="Community forum and embers. Gather at the Hearth." />
        <link rel="canonical" href="https://www.vauntico.com/hearth" />
      </Helmet>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Hearth</h1>
        <p className="text-gray-400">Community space coming soon. Share insights, rituals, and wins.</p>
      </main>
    </div>
  )
}
