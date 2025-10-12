import React, { useState } from 'react'

export function NexusCaller() {
  const [fromD, setFromD] = useState('C:')
  const [toD, setToD] = useState('D:')
  const lang = localStorage.getItem('dm-lang') || 'en'
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Novice Nexus <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.85 }}>
        <TranslationTooltip label="Rite: Cosmic Culmination" lore="Lore: Cosmic Culmination" light="Light: Final Compliance Setup" why="Tie histories with audits for revert‑ready teaching." />
      </span></h3>
      <div>
        <label>From: <input value={fromD} onChange={e=>setFromD(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>To: <input value={toD} onChange={e=>setToD(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js onboarding-nexus --from ${fromD} --to ${toD}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Call Novice Nexus?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Language: {lang}. Writes logs/nexus-teach.yml + onboarding-nexus.json</div>
    </div>
  )
}