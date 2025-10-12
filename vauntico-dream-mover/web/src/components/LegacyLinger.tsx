import React, { useState } from 'react'

export function LegacyLinger() {
  const [rite, setRite] = useState('sim')
  const [user, setUser] = useState('stub')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Legacy Lore</h3>
      <div>
        <label>Rite: <input value={rite} onChange={e=>setRite(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>User: <input value={user} onChange={e=>setUser(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js legacy-lore --rite ${rite} --user ${user}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Linger Lore?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Writes logs/personal-lore.json and embeds rollback chain YAML (stub).
      </div>
    </div>
  )
}