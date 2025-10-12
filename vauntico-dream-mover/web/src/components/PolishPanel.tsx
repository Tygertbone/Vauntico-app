import React from 'react'

export function PolishPanel() {
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Launch Polish</h3>
      <p>Enable beta palette and write vercel env stub (DM_BETA) for mock deploy.</p>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
        const cmd = 'node vauntico-dream-mover/dist/cli.js launch-polish --beta'
        alert(`Run via Warp:\n${cmd}`)
      }}>Beta Shine?</button>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
        Mock deploy: https://vercel.com/vauntico/dream-mover?env=DM_BETA
      </div>
    </div>
  )
}