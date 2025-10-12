import React, { useState } from 'react'

export function BlitzSigil() {
  const [attendees, setAttendees] = useState(10)
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Blitz Sigil</h3>
      <div>
        <label>Attendees: <input type="number" value={attendees} onChange={e=>setAttendees(parseInt(e.target.value || '10'))} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        alert(`Run in Warp:\nnode vauntico-dream-mover/dist/cli.js gtm-workshop --attendees ${attendees} --out vauntico-dream-mover/workshops/workshop.yml`)
      }}>Generate Workshop</button>
    </div>
  )
}
