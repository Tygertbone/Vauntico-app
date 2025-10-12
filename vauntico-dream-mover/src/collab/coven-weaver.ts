import fs from 'fs'
import path from 'path'

export interface SharedLibEntry {
  planId: string
  teamId: string
  required: number
  approvals: number
  approved: boolean
  createdAt: string
}

const SHARED_PATH = path.join('vauntico-dream-mover','collab','sharedLibs','index.json')

function readIndex(): SharedLibEntry[] {
  try { return JSON.parse(fs.readFileSync(SHARED_PATH, 'utf8')) } catch { return [] }
}

function writeIndex(entries: SharedLibEntry[]) {
  fs.mkdirSync(path.dirname(SHARED_PATH), { recursive: true })
  fs.writeFileSync(SHARED_PATH, JSON.stringify(entries, null, 2))
}

export function shareLib(planId: string, teamId: string, required = 2): SharedLibEntry {
  const idx = readIndex()
  const createdAt = new Date().toISOString()
  const entry: SharedLibEntry = { planId, teamId, required, approvals: 0, approved: false, createdAt }
  idx.push(entry)
  writeIndex(idx)
  return entry
}

export function voteShare(planId: string, teamId: string): SharedLibEntry | null {
  const idx = readIndex()
  const found = idx.find(e => e.planId === planId && e.teamId === teamId)
  if (!found) return null
  found.approvals += 1
  if (found.approvals >= found.required) found.approved = true
  writeIndex(idx)
  return found
}