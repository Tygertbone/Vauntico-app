import React, { useState } from 'react'

export function ServicesSigil() {
  const [hours, setHours] = useState(4)
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Services Sigil</h3>
      <div>
        <label>Hours: <input type="number" value={hours} onChange={e=>setHours(parseInt(e.target.value || '4'))} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={()=>{
        alert(`Run in Warp:\nnode vauntico-dream-mover/dist/cli.js services-consult --hours ${hours} --out vauntico-dream-mover/services/consult.yml`)
      }}>Generate Consult</button>
    </div>
  )
}