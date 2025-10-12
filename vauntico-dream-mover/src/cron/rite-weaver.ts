import fs from 'fs'
import path from 'path'

export function scheduleInfuse(plan: string, cronExpr: string, template: 'gdpr'|'hipaa') {
  const out = path.join('vauntico-dream-mover','logs','cron-schedule.json')
  const payload = { plan, cronExpr, template, createdAt: new Date().toISOString() }
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(payload, null, 2))
  return payload
}