import fs from 'fs'
import path from 'path'

export type ImmutableAudit = {
  riteId: string
  timestamp: string
  consent: boolean
  SOC2: { controls: string[] }
}

export function soc2Immutable(riteId: string, controls: string[] = ['encryption','retention'], consent = true, logsDir = 'logs') {
  fs.mkdirSync(logsDir, { recursive: true })
  const auditPath = path.join(logsDir, 'eternal-audit.json')
  let arr: ImmutableAudit[] = []
  if (fs.existsSync(auditPath)) {
    try { arr = JSON.parse(fs.readFileSync(auditPath, 'utf8')) } catch {}
  }
  const rec: ImmutableAudit = {
    riteId,
    timestamp: new Date().toISOString(),
    consent: !!consent,
    SOC2: { controls: Array.from(new Set(controls)) }
  }
  arr.push(rec)
  fs.writeFileSync(auditPath, JSON.stringify(arr, null, 2))
  return rec
}