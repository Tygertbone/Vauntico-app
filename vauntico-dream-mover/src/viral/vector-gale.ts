import fs from 'fs'
import path from 'path'

export type ShareLog = {
  riteId: string
  platform: 'x' | 'reddit'
  text: string
  link: string
  viralScore: number
  at: string
}

export function shareRite(riteId: string, platform: 'x'|'reddit' = 'x', logsDir = 'logs'): ShareLog {
  const text = `Dream Mover rite ${riteId} — safe, reversible, auditable. #DreamMover #Vauntico`
  const link = 'https://example.com/dream-mover' // stub link
  const viralScore = Math.floor(50 + Math.random() * 50) // 50-99 stub
  const entry: ShareLog = { riteId, platform, text, link, viralScore, at: new Date().toISOString() }
  const outPath = path.join(logsDir, 'viral-vectors.json')
  fs.mkdirSync(logsDir, { recursive: true })
  let arr: ShareLog[] = []
  if (fs.existsSync(outPath)) {
    try { arr = JSON.parse(fs.readFileSync(outPath, 'utf8')) } catch {}
  }
  arr.push(entry)
  fs.writeFileSync(outPath, JSON.stringify(arr, null, 2))
  return entry
}