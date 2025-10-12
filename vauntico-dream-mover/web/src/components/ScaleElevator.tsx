import React, { useState } from 'react'

export function ScaleElevator() {
  const [region, setRegion] = useState<'za'|'us'>('za')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Scale Elevator</h3>
      <div>
        <label>Region: </label>
        <select value={region} onChange={e=>setRegion(e.target.value as any)}>
          <option value="za">ZA</option>
          <option value="us">US</option>
        </select>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js scale-elevate --region ${region}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Elevate Global?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Writes vercel-env.json + scale-elev.json; ties to ZAR costs.</div>
    </div>
  )
}