import React, { useState } from 'react'

export function ViralVector() {
  const [platform, setPlatform] = useState<'x'|'reddit'>('x')
  const [text, setText] = useState('Dream Mover rite sim — safe, reversible, auditable. #DreamMover #Vauntico')
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Viral Vectors</h3>
      <div>
        <label>Platform: </label>
        <select value={platform} onChange={e=>setPlatform(e.target.value as any)}>
          <option value="x">X</option>
          <option value="reddit">Reddit</option>
        </select>
      </div>
      <div style={{ marginTop: 8 }}>
        <textarea rows={3} cols={60} value={text} onChange={e=>setText(e.target.value)} />
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js viral-share --rite sim --platform ${platform}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Gale on {platform === 'x' ? 'X' : 'Reddit'}?</button>
      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>Tip: Shares can feed back into NPS — consider logging a 10 right after sharing.</div>
    </div>
  )
}