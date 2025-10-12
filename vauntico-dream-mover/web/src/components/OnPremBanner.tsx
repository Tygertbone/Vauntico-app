import React from 'react'

export function OnPremBanner() {
  const onprem = localStorage.getItem('dm-onprem') === 'true'
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>On-Prem Bastion</h3>
      <div>Status: {onprem ? 'Self-Host Mode' : 'Cloud Mode (stub)'}</div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const next = !onprem
        localStorage.setItem('dm-onprem', next ? 'true' : 'false')
        alert(`On-Prem toggle: ${next}`)
      }}>Toggle On-Prem</button>
    </div>
  )
}
