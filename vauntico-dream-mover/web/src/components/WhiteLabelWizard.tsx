import React from 'react'

export function WhiteLabelWizard() {
  return (
    <div style={{ border: '1px solid #666', padding: 12, borderRadius: 8 }}>
      <h3>White-Label Wizard</h3>
      <p>Generate an SLA contract YAML (stub) and attach to your plan.</p>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
        const org = prompt('Organization name?') || 'Vauntico Corp'
        alert(`Run in Warp:\nnode vauntico-dream-mover/dist/cli.js white-label --org "${org}" --soc2 --uptime 99.9%`)
      }}>Generate SLA</button>
    </div>
  )
}
