import React, { useState } from 'react'

export function BetaLoop() {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(9)
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Beta Buzz</h3>
      <p>Post-simulation feedback loop (stub). Records NPS-like score to logs/feedback-loops.json.</p>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => setOpen(true)}>Buzz Feedback?</button>
      {open && (
        <div style={{ marginTop: 8, padding: 12, border: '1px dashed #666', borderRadius: 8 }}>
          <div>
            <label>How safe was the rite? (0-10) <input type="number" min={0} max={10} value={score} onChange={e=>setScore(parseInt(e.target.value||'0'))} /></label>
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => {
              const cmd = `node vauntico-dream-mover/dist/cli.js beta-survey --rite sim --score ${score}`
              alert(`Run via Warp:\n${cmd}`)
              setOpen(false)
            }}>Submit</button>
            <button style={{ marginLeft: 8 }} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}