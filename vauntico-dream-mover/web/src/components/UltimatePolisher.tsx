import React, { useState } from 'react'

export function UltimatePolisher() {
  const [config, setConfig] = useState('beta')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Ultimate Polish</h3>
      <div>
        <label>Config: <input value={config} onChange={e=>setConfig(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js ultimate-polish --config ${config}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Ultimate Polish?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Writes logs/ultimate-polish.json with DM_ULTIMATE=true and multi‑region + multi‑lang dict.</div>
    </div>
  )
}