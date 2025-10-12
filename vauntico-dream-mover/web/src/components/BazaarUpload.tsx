import React, { useState } from 'react'

export function BazaarUpload() {
  const [plan, setPlan] = useState('vauntico-dream-mover/plans/monorepo-ai-links.gdpr.yml')
  const [price, setPrice] = useState(10)
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Bazaar Upload</h3>
      <div>
        <label>Plan: <input value={plan} onChange={e=>setPlan(e.target.value)} /></label>
        <label style={{ marginLeft: 8 }}>Price (USD): <input type="number" value={price} onChange={e=>setPrice(parseFloat(e.target.value || '10'))} /></label>
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={()=>{
        alert(`Run in Warp:\nnode vauntico-dream-mover/dist/cli.js marketplace-upload --plan ${plan} --price ${price}`)
      }}>Upload Rite</button>
    </div>
  )
}