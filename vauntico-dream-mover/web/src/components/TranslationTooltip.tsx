import React, { useState } from 'react'

export function TranslationTooltip({ label, lore, light, why }: { label: string, lore: string, light: string, why: string }) {
  const [hover, setHover] = useState(false)
  const tier = (localStorage.getItem('dm-tier') || 'Seeker')
  const showFull = tier !== 'Seeker'
  return (
    <span style={{ position: 'relative' }} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>{label}</span>
      {hover && (
        <div style={{ position: 'absolute', top: '1.4em', left: 0, zIndex: 50, background: '#0b1020', color: '#fff', border: '1px solid #444', padding: 10, borderRadius: 8, width: 300 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{lore}</div>
          {showFull ? (
            <>
              <div>{light}</div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>{why}</div>
            </>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.85 }}>Upgrade to Practitioner to see the full Light.</div>
          )}
        </div>
      )}
    </span>
  )
}