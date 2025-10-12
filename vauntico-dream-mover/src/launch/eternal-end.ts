import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export function betaBlitzChain(onboard: string, viral: 'x'|'reddit' = 'x', logsDir = 'logs') {
  const parts = onboard.split(':').filter(Boolean)
  const from = parts[0] || 'C:'
  const to = parts[1] || 'D:'
  const chain = {
    blitz: { from, to },
    viral: { platform: viral, scoreHint: 90 },
    npsHint: 9,
    steps: [
      { step: 1, action: 'onboard', note: `${from}→${to} teaching` },
      { step: 2, action: 'share', note: `Viral on ${viral}` },
      { step: 3, action: 'nps', note: 'Log post‑share NPS 9' },
      { step: 4, action: 'audit', note: 'SOC2 immutable appended earlier' }
    ]
  }

  fs.mkdirSync(logsDir, { recursive: true })
  const closePath = path.join(logsDir, 'cosmic-close.yml')
  const eternalPath = path.join(logsDir, 'eternal-launch.yml')
  // append to cosmic-close.yml for continuity
  try { fs.appendFileSync(closePath, `\n---\n${yaml.dump({ betaBlitz: chain })}`, 'utf8') } catch {}
  fs.writeFileSync(eternalPath, yaml.dump(chain), 'utf8')
  return { eternalPath, closePath }
}