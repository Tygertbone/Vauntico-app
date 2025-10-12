import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export interface VetIssue { file: string, rule: string, message: string }

function readYaml(p: string): any {
  try { return yaml.load(fs.readFileSync(p, 'utf8')) } catch { return null }
}

function isDbOrDocker(filePath: string): boolean {
  const s = filePath.toLowerCase()
  return s.includes('db') || s.includes('docker') || s.includes('postgres')
}

export function vetPlan(filePath: string, rulesCfg: any): VetIssue[] {
  const issues: VetIssue[] = []
  const doc: any = readYaml(filePath)
  if (!doc || typeof doc !== 'object') {
    issues.push({ file: filePath, rule: 'parse', message: 'YAML parse failed' })
    return issues
  }
  const rules = Array.isArray(doc.rules) ? doc.rules : []
  const hasDryRun = rules.some((r: any) => r?.action?.dryRun === true)
  if (!hasDryRun) {
    issues.push({ file: filePath, rule: 'require-dry-run', message: 'No action has dryRun:true' })
  }
  for (const r of rules) {
    const v = r?.action?.verify
    if (!v || !['hash', 'sample', 'none'].includes(String(v))) {
      issues.push({ file: filePath, rule: 'verify-present', message: 'Missing or invalid verify mode on an action' })
    }
  }
  if (isDbOrDocker(filePath)) {
    const notesHit = rules.some((r: any) => typeof r?.action?.notes === 'string' && r.action.notes.length >= (rulesCfg?.notesMinLen || 30))
    if (!notesHit) {
      issues.push({ file: filePath, rule: 'service-lock-note', message: 'Missing adequate service lock note (notes >= 30 chars)' })
    }
  }
  return issues
}

export async function vetDir(dir: string, reportOut?: string): Promise<{ issues: VetIssue[] }> {
  const rulesPath = path.join(process.cwd(), 'vauntico-dream-mover', 'marketplace', 'vet-rules.json')
  const rulesCfg = JSON.parse(fs.readFileSync(rulesPath, 'utf8'))
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml')).map(f => path.join(dir, f))
  const issues: VetIssue[] = []
  for (const f of files) {
    issues.push(...vetPlan(f, rulesCfg))
  }
  if (reportOut) {
    fs.mkdirSync(path.dirname(reportOut), { recursive: true })
    fs.writeFileSync(reportOut, JSON.stringify({ issues }, null, 2))
  }
  return { issues }
}

if (require.main === module) {
  const dir = process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : 'vauntico-dream-mover/plans'
  const reportIdx = process.argv.indexOf('--report')
  const report = reportIdx > -1 ? process.argv[reportIdx + 1] : ''
  vetDir(dir, report).then(({ issues }) => {
    if (issues.length) {
      console.log('Marketplace vet issues:')
      for (const i of issues) console.log(`- ${i.file}: ${i.rule} — ${i.message}`)
      process.exit(1)
    } else {
      console.log('Marketplace: All plans certified ✅')
    }
  })
}
