import fs from 'fs'
import path from 'path'
import { vetPlan } from './vetter'

export interface UploadEntry {
  planPath: string
  userId: string
  priceUSD: number
  certified: boolean
  commissionUSD: number
  createdAt: string
}

const INDEX_PATH = path.join('vauntico-dream-mover','marketplace','full-index.json')

function readIndex(): UploadEntry[] {
  try { return JSON.parse(fs.readFileSync(INDEX_PATH,'utf8')) } catch { return [] }
}

function writeIndex(entries: UploadEntry[]) {
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true })
  fs.writeFileSync(INDEX_PATH, JSON.stringify(entries, null, 2))
}

export function uploadPlan(planPath: string, userId: string, priceUSD: number): UploadEntry {
  if (priceUSD < 5) throw new Error('Price must be at least $5')
  const rulesCfgPath = path.join('vauntico-dream-mover','marketplace','vet-rules.json')
  const rulesCfg = JSON.parse(fs.readFileSync(rulesCfgPath, 'utf8'))
  const issues = vetPlan(planPath, rulesCfg)
  if (issues.length) throw new Error('Vet failed: ' + issues.map(i=>i.rule).join(','))
  const commissionUSD = +(priceUSD * 0.20).toFixed(2)
  const entry: UploadEntry = {
    planPath,
    userId,
    priceUSD,
    commissionUSD,
    certified: true,
    createdAt: new Date().toISOString()
  }
  const idx = readIndex()
  idx.push(entry)
  writeIndex(idx)
  return entry
}