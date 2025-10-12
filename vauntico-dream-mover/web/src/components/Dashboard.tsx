import React from 'react'

export function Dashboard(props: { plan: string, onPlanChange: (v: string) => void, onRunHint: () => void }) {
  const { plan, onPlanChange, onRunHint } = props
  return (
    <div>
      <label>
        Plan path:
        <input style={{ marginLeft: 8, width: 520 }} value={plan} onChange={e => onPlanChange(e.target.value)} />
      </label>
      <div style={{ marginTop: 12 }}>
        <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={onRunHint}>Run via Warp (Simulate)</button>
      </div>
    </div>
  )
}
