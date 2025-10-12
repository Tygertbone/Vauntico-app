import React from 'react'

export function TierGate(props: { level: string, ritualsLeft: number|'infinite', onUpgrade: () => void }) {
  const { level, ritualsLeft, onUpgrade } = props
  const isSeeker = level === 'Seeker'
  return (
    <div style={{ border: '1px solid #333', padding: 12, borderRadius: 8, marginTop: 12 }}>
      <div>Tier: <b>{level}</b> — Rituals remaining today: <b>{ritualsLeft}</b></div>
      {isSeeker && (
        <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={onUpgrade}>
          Unlock ∞ rituals (Practitioner $6/mo)
        </button>
      )}
    </div>
  )
}