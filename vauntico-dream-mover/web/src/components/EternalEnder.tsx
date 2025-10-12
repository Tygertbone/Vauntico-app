import React, { useState } from 'react'

export function EternalEnder() {
  const [blitz, setBlitz] = useState('C:D:')
  const [viral, setViral] = useState<'x'|'reddit'>('x')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Eternal Launch</h3>
      <div>
        <label>Blitz (C:D:): <input value={blitz} onChange={e=>setBlitz(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Viral platform: </label>
        <select value={viral} onChange={e=>setViral(e.target.value as any)}>
          <option value="x">X</option>
          <option value="reddit">Reddit</option>
        </select>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js eternal-launch --blitz ${blitz} --viral ${viral}`
        alert(`Run via Warp:\n${cmd}`)
      }}>End Eternal?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Appends chain to cosmic-close.yml and writes logs/eternal-launch.yml.</div>
    </div>
  )
}