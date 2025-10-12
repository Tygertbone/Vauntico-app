import React, { useState } from 'react'

export function CovenCollab() {
  const [planId, setPlanId] = useState('monorepo-ai-links.gdpr.yml')
  const [teamId, setTeamId] = useState('guild-stub')
  const [req, setReq] = useState(2)

  return (
    <div style={{ border: '1px dashed #777', padding: 12, borderRadius: 8 }}>
      <h3>Coven Collaboration</h3>
      <div>
        <label>Plan Id: <input value={planId} onChange={e => setPlanId(e.target.value)} /></label>
        <label style={{ marginLeft: 12 }}>Team Id: <input value={teamId} onChange={e => setTeamId(e.target.value)} /></label>
        <label style={{ marginLeft: 12 }}>Required Votes: <input type="number" value={req} onChange={e => setReq(parseInt(e.target.value||'2'))} /></label>
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
          alert(`Run in Warp to share:\nnode vauntico-dream-mover/dist/cli.js coven-share --plan-id ${planId} --team-id ${teamId} --req ${req}`)
        }}>Share to Guild</button>
        <button style={{ marginLeft: 8 }} className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
          alert(`Run in Warp to vote:\nnode vauntico-dream-mover/dist/cli.js coven-vote --plan-id ${planId} --team-id ${teamId}`)
        }}>Cast Approval (vote)</button>
      </div>
    </div>
  )
}