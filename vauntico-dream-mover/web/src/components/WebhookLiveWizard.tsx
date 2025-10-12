import React, { useState } from 'react'

export function WebhookLiveWizard() {
  const [event, setEvent] = useState<'create'|'update'>('create')
  const [key, setKey] = useState('mock')
  const [amount, setAmount] = useState(6)
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Webhook Live</h3>
      <div>
        <label>Event: </label>
        <select value={event} onChange={e=>setEvent(e.target.value as any)}>
          <option value="create">create</option>
          <option value="update">update</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Key: <input value={key} onChange={e=>setKey(e.target.value)} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Amount (ZAR): <input type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||'6'))} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js webhook-live --event ${event} --key ${key} --amount ${amount}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Live Flip?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Simulated verification; no external calls are made in OSS build.</div>
    </div>
  )
}