import React, { useState } from 'react'

export function LiveScaleElevator() {
  const [region, setRegion] = useState<'za'|'us'>('za')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Live Scale</h3>
      <div>
        <label>Region: </label>
        <select value={region} onChange={e=>setRegion(e.target.value as any)}>
          <option value="za">ZA</option>
          <option value="us">US</option>
        </select>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js scale-live --region ${region}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Live Elevate?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Writes logs/scale-live.json with DM_SCALE and mock ngrok/vercel links.</div>
    </div>
  )
}