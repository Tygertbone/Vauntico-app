import React, { useMemo, useState } from 'react'

export function App() {
  const [plan, setPlan] = useState('vauntico-dream-mover/plans/developer-storage.sample.yml')
  const [manifestPath, setManifestPath] = useState('vauntico-dream-mover/logs/manifest.json')

  const tips = useMemo(() => [
    'Simulate first. Migrate only after reading the report.',
    'Keep dryRun true for first rehearsals.',
    'Use rollback with last-run.json to restore deterministically.'
  ], [])

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <h1>Dream Mover • Eternal Ritual Nexus</h1>
      <p style={{ opacity: 0.8 }}>Migrate with ceremony. Rollback with confidence.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Ritual Picker</h2>
        <label>
          Plan path:
          <input style={{ marginLeft: 8, width: 520 }} value={plan} onChange={e => setPlan(e.target.value)} />
        </label>
        <div style={{ marginTop: 12 }}>
          <button className=\"hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300\" title=\"simulate\" onClick={() => alert(`Simulate → ${plan}\\n(Invoke CLI via workflow)`)}>Simulate</button>
          <button className=\"hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300\" style={{ marginLeft: 8 }} title=\"migrate\" onClick={() => alert(`Migrate using manifest → ${manifestPath}`)}>Migrate</button>
          <button className=\"hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300\" style={{ marginLeft: 8 }} title=\"rollback\" onClick={() => alert('Rollback using logs/last-run.json')}>Rollback</button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Tips</h2>
        <ul>
          {tips.map((t, i) => (<li key={i}>{t}</li>))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Analytics (stub)</h2>
        <p>Planned: time saved, space freed, risk scores, collision previews, shadow maps.</p>
      </section>
    </div>
  )
}
