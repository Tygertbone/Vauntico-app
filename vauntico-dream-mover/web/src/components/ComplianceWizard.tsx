import React, { useState } from 'react'

export function ComplianceWizard() {
  const [template, setTemplate] = useState<'gdpr'|'hipaa'>('gdpr')
  return (
    <div style={{ border: '1px solid #444', padding: 12, borderRadius: 8 }}>
      <h3>Compliance Wizard</h3>
      <div>
        <label>
          Template:
          <select value={template} onChange={(e) => setTemplate(e.target.value as any)} style={{ marginLeft: 8 }}>
            <option value="gdpr">GDPR</option>
            <option value="hipaa">HIPAA</option>
          </select>
        </label>
        <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginLeft: 8 }} onClick={() => {
          alert(`Run in Warp: node vauntico-dream-mover/dist/cli.js rune-infuse --template ${template} --plan vauntico-dream-mover/plans/db-relocation.sample.yml --out vauntico-dream-mover/plans/db-relocation.${template}.yml`)
        }}>Infuse</button>
      </div>
      <p style={{ opacity: 0.8, marginTop: 8 }}>This is a dry-run wizard. It prints the exact CLI to weave compliance runes.</p>
    </div>
  )
}
