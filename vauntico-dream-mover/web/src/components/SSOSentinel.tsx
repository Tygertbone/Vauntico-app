import React from 'react'

export function SSOSentinel() {
  return (
    <div style={{ border: '1px solid #444', padding: 12, borderRadius: 8 }}>
      <h3>SSO Sentinel</h3>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
        const email = prompt('Enter org email for SSO (stub):') || 'guild@example.com'
        alert(`Run in Warp to stub SSO token and tie tier:\nnode vauntico-dream-mover/dist/cli.js tier-check --sso-provider google --email ${email}`)
        localStorage.setItem('dm-tier','Guild')
        alert('Tier set to Guild (local).')
      }}>Sign in with Google (stub)</button>
    </div>
  )
}