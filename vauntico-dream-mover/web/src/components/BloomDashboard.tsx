import React, { useState } from 'react'

export function BloomDashboard() {
  const [plan, setPlan] = useState('vauntico-dream-mover/plans/monorepo-ai-links.gdpr.yml')
  const [caseStudy, setCaseStudy] = useState('Success story...')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Bloom Dashboard</h3>
      <div>
        <label>Plan: <input value={plan} onChange={e=>setPlan(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <textarea value={caseStudy} onChange={e=>setCaseStudy(e.target.value)} rows={4} cols={60} />
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        alert(`Run in Warp:\nnode vauntico-dream-mover/dist/cli.js gtm-launch --plan ${plan} --case "${caseStudy}"`)
      }}>Launch Bazaar Rite</button>
    </div>
  )
}
