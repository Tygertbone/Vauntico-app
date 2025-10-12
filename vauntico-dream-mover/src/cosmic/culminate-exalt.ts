import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export type CosmicChain = {
  nexus: string
  legacy: string
  audit: { soc2: boolean, controls: string[] }
  steps: { step: number, action: string, note: string }[]
}

export function legacyOnboard(nexus: string, legacy: string, logsDir = 'logs') {
  const parts = nexus.split(':').filter(Boolean)
  const from = (parts[0] || 'C:')
  const to = (parts[1] || 'D:')

  const chain: CosmicChain = {
    nexus,
    legacy,
    audit: { soc2: true, controls: ['encryption','retention'] },
    steps: [
      { step: 1, action: 'teach', note: `Onboard ${from}→${to}` },
      { step: 2, action: 'lore', note: `Record legacy rite ${legacy}` },
      { step: 3, action: 'audit', note: 'Append SOC2 immutable fields' }
    ]
  }

  fs.mkdirSync(logsDir, { recursive: true })
  // Append chain to nexus-teach.yml as a new document separator
  const teachPath = path.join(logsDir, 'nexus-teach.yml')
  const chainDoc = yaml.dump({ cosmicChain: chain })
  try { fs.appendFileSync(teachPath, `\n---\n${chainDoc}`, 'utf8') } catch {}

  // Also write a dedicated cosmic-close.yml
  const closePath = path.join(logsDir, 'cosmic-close.yml')
  fs.writeFileSync(closePath, yaml.dump(chain), 'utf8')
  return { teachPath, closePath }
}