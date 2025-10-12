import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export type LoreEntry = {
  riteId: string
  user: string
  at: string
}

export type PersonalLore = {
  history: LoreEntry[]
  chains: string // rollback chain YAML (inline for stub)
}

export function personalGrimoire(riteId: string, user = 'stub', logsDir = 'logs'): PersonalLore {
  const lorePath = path.join(logsDir, 'personal-lore.json')
  fs.mkdirSync(logsDir, { recursive: true })
  let history: LoreEntry[] = []
  if (fs.existsSync(lorePath)) {
    try { history = JSON.parse(fs.readFileSync(lorePath, 'utf8')) } catch {}
  }
  const entry: LoreEntry = { riteId, user, at: new Date().toISOString() }
  history.push(entry)
  fs.writeFileSync(lorePath, JSON.stringify(history, null, 2))

  // Construct a ceremonial rollback chain (YAML stub)
  const chainDoc = yaml.dump({
    rollback: {
      rite: riteId,
      steps: [
        { step: 1, action: 'snapshot', note: 'Create time capsule' },
        { step: 2, action: 'verify', note: 'Check hashes or samples' },
        { step: 3, action: 'restore', note: 'Deterministic rollback if needed' }
      ]
    }
  })

  return { history, chains: chainDoc }
}