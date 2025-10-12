import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export type NexusTeach = {
  from: string
  to: string
  why: string
  safeMoves: { path: string, reason: string, revert: string }[]
}

export function spaceWhisper(driveFrom: string, driveTo: string, logsDir = 'logs') {
  const teach: NexusTeach = {
    from: driveFrom,
    to: driveTo,
    why: 'Reclaim space and improve performance by linking ephemeral caches.',
    safeMoves: [
      { path: '%TEMP%', reason: 'Ephemeral temp files', revert: 'Remove link to revert' },
      { path: '%USERPROFILE%/AppData/Local/pnpm/store', reason: 'Cache store (safe to link)', revert: 'Relink to original path' },
      { path: '%LOCALAPPDATA%/npm-cache', reason: 'npm cache (safe)', revert: 'Copy back then unlink' }
    ]
  }

  fs.mkdirSync(logsDir, { recursive: true })
  const teachPath = path.join(logsDir, 'nexus-teach.yml')
  fs.writeFileSync(teachPath, yaml.dump(teach), 'utf8')

  const logPath = path.join(logsDir, 'onboarding-nexus.json')
  let arr: any[] = []
  if (fs.existsSync(logPath)) {
    try { arr = JSON.parse(fs.readFileSync(logPath, 'utf8')) } catch {}
  }
  arr.push({ from: driveFrom, to: driveTo, at: new Date().toISOString(), sizeHint: '1GB reclaim (stub)' })
  fs.writeFileSync(logPath, JSON.stringify(arr, null, 2))

  return { teachPath, logPath }
}