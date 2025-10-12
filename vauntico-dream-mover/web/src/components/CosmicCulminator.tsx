import React, { useState } from 'react'

export function CosmicCulminator() {
  const [nexus, setNexus] = useState('C:D:')
  const [legacy, setLegacy] = useState('sim')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Cosmic Culmination</h3>
      <div>
        <label>Nexus (C:D:): <input value={nexus} onChange={e=>setNexus(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Legacy rite: <input value={legacy} onChange={e=>setLegacy(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js cosmic-close --nexus ${nexus} --legacy ${legacy}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Culminate Cosmic?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Appends chain to nexus-teach.yml and writes logs/cosmic-close.yml.</div>
    </div>
  )
}