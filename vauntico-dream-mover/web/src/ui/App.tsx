import React, { useMemo, useState } from 'react'

import { Dashboard } from '../components/Dashboard'
import { AuditSummary } from '../components/AuditSummary'
import { ShadowViewer } from '../components/ShadowViewer'
import { TierGate } from '../components/TierGate'
import { CertQuest } from '../components/CertQuest'
import { ComplianceWizard } from '../components/ComplianceWizard'
import { SSOSentinel } from '../components/SSOSentinel'
import { CovenCollab } from '../components/CovenCollab'
import { OnPremBanner } from '../components/OnPremBanner'
import { WhiteLabelWizard } from '../components/WhiteLabelWizard'
import { ApiPortal } from '../components/ApiPortal'
import { CronRite } from '../components/CronRite'
import { BazaarUpload } from '../components/BazaarUpload'
import { ServicesSigil } from '../components/ServicesSigil'

export function App() {
  const [plan, setPlan] = useState('vauntico-dream-mover/plans/developer-storage.sample.yml')
  const [manifestPath, setManifestPath] = useState('vauntico-dream-mover/logs/manifest.json')

  const tips = useMemo(() => [
    'Simulate first. Migrate only after reading the report.',
    'Keep dryRun true for first rehearsals.',
    'Use rollback with last-run.json to restore deterministically.'
  ], [])

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: 24 }}>
      <h1>Dream Mover • Eternal Ritual Nexus</h1>
      <p style={{ opacity: 0.8 }}>Migrate with ceremony. Rollback with confidence.</p>

      <section style={{ marginTop: 24 }}>
        <h2>Ritual Picker</h2>
        <TierGate level={localStorage.getItem('dm-tier') || 'Seeker'} ritualsLeft={5} onUpgrade={() => {
          const email = prompt('Enter email for Paystack checkout:') || 'test@example.com'
          window.open(`https://paystack.com/pay/intent?email=${encodeURIComponent(email)}&amount=600&currency=ZAR`, '_blank')
          localStorage.setItem('dm-tier','Practitioner')
          alert('Practitioner unlock simulated. Reload to reflect.')
        }} />
        <Dashboard plan={plan} onPlanChange={setPlan} onRunHint={() => {
          const cmd = `node vauntico-dream-mover/dist/cli.js simulate --plan ${plan} --report vauntico-dream-mover/logs/report.json --out vauntico-dream-mover/logs/manifest.json`
          alert(`Run via Warp:\n${cmd}`)
        }} />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Audit Summary</h2>
        <AuditSummary manifestUrl={"/dm-logs/manifest.json"} lastRunUrl={"/dm-logs/last-run.json"} fallbackHint="Serve logs via localhost:3000 or open directly from vauntico-dream-mover/logs" />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Shadow Map</h2>
        <ShadowViewer mmdUrl="/dm-logs/shadow-map.mmd" />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Certification</h2>
        <CertQuest />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Compliance</h2>
        <ComplianceWizard />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>SSO & Collaboration</h2>
        <SSOSentinel />
        <div style={{ height: 8 }} />
        <CovenCollab />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>On-Prem & White-Label</h2>
        <OnPremBanner />
        <div style={{ height: 8 }} />
        <WhiteLabelWizard />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>API & Cron</h2>
        <ApiPortal />
        <div style={{ height: 8 }} />
        <CronRite />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Bazaar & Services</h2>
        <BazaarUpload />
        <div style={{ height: 8 }} />
        <ServicesSigil />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Tips</h2>
        <ul>
          {tips.map((t, i) => (<li key={i}>{t}</li>))}
        </ul>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Analytics (stub)</h2>
        <p>Planned: time saved, space freed, risk scores, collision previews, shadow maps.</p>
      </section>
    </div>
  )
}
