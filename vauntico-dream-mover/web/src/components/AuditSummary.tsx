import React, { useEffect, useState } from 'react'

export function AuditSummary(props: { manifestUrl: string, lastRunUrl: string, fallbackHint?: string }) {
  const { manifestUrl, lastRunUrl, fallbackHint } = props
  const [manifest, setManifest] = useState<any>(null)
  const [lastRun, setLastRun] = useState<any>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const m = await fetch(manifestUrl)
        if (m.ok) setManifest(await m.json())
      } catch (e:any) {
        setError('manifest')
      }
      try {
        const r = await fetch(lastRunUrl)
        if (r.ok) setLastRun(await r.json())
      } catch (e:any) {
        setError(prev => prev || 'lastRun')
      }
    }
    load()
  }, [manifestUrl, lastRunUrl])

  if (!manifest && !lastRun) {
    return <div style={{ opacity: 0.8 }}>No logs available. {fallbackHint}</div>
  }

  const risk = manifest?.riskScore
  const items = lastRun?.items || []
  const spaceSavedMB = (manifest?.estimatedSpaceFreedBytes || 0) / 1_000_000

  return (
    <div>
      <div>Space saved (est): {spaceSavedMB.toFixed(2)} MB</div>
      <div>Risk score: {risk ? `${risk.total} (${(risk.factors||[]).join(', ')})` : 'n/a'}</div>
      <div>Last run items: {items.length || 0}</div>
      {items.length > 0 && (
        <table style={{ marginTop: 12, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr><th align="left">Action</th><th align="left">Path</th><th align="left">Dest</th><th align="left">Result</th></tr>
          </thead>
          <tbody>
            {items.slice(0, 10).map((it:any, idx:number) => (
              <tr key={idx}>
                <td>{it.actionType}</td>
                <td>{it.itemPath}</td>
                <td>{it.destination}</td>
                <td>{it.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
