import React, { useEffect, useState } from 'react'

export function GlobalGilder() {
  const [lang, setLang] = useState<string>(() => localStorage.getItem('dm-lang') || 'en')
  useEffect(() => { localStorage.setItem('dm-lang', lang) }, [lang])
  const practitioner = (localStorage.getItem('dm-tier') || 'Seeker') !== 'Seeker'
  return (
    <div style={{ border: '1px solid #555', padding: 12, borderRadius: 8 }}>
      <h3>Global Glory</h3>
      <div>
        <label>Language: </label>
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="af">Afrikaans</option>
        </select>
        {!practitioner && (<span style={{ marginLeft: 8, fontSize: 12, opacity: 0.8 }}>(Practitioner unlocks multi‑lang)</span>)}
      </div>
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" style={{ marginTop: 8 }} onClick={() => {
        const cmd = `node vauntico-dream-mover/dist/cli.js global-i18n --plan vauntico-dream-mover/plans/docker-volumes.sample.yml --lang ${lang}`
        alert(`Run via Warp:\n${cmd}`)
      }}>Gild Afrikaans?</button>
    </div>
  )
}