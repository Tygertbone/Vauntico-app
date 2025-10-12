import React, { useState } from 'react'

export function MVPLauncher() {
  const [config, setConfig] = useState('beta')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Cosmic Launch <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.85 }}>
        <TranslationTooltip label="Rite: Cosmic Culmination" lore="Lore: Cosmic Culmination" light="Light: Final Compliance Setup" why="Tie histories with audits for revert‑ready teaching." />
      </span></h3>
      <div>
        <label>Config: <input value={config} onChange={e=>setConfig(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js launch-mvp --config ${config}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Launch Cosmic?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Writes logs/mvp-deploy.json with DM_LAUNCH=true and mock link.</div>
    </div>
  )
}