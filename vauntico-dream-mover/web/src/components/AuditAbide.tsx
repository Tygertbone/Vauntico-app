import React, { useState } from 'react'

export function AuditAbide() {
  const [soc2, setSoc2] = useState(true)
  const [controls, setControls] = useState('encryption,retention')
  const rite = 'sim'
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Eternal Audit</h3>
      <div>
        <label><input type="checkbox" checked={soc2} onChange={e=>setSoc2(e.target.checked)} /> SOC2</label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Controls: <input value={controls} onChange={e=>setControls(e.target.value)} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const flag = soc2 ? ' --soc2' : ''
        const cmd = `node vauntico-dream-mover/dist/cli.js audit-eternal --rite ${rite}${flag} --controls ${controls}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Abide Audit?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Appends to logs/eternal-audit.json with immutable SOC2 fields (stub).</div>
    </div>
  )
}