import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export function infusePlan(planPath: string, templateName: 'gdpr'|'hipaa', outPath?: string): { out: string } {
  const planDoc: any = yaml.load(fs.readFileSync(planPath, 'utf8'))
  const tmplPath = path.join('vauntico-dream-mover','compliance','templates', `${templateName}.yml`)
  const tmpl: any = yaml.load(fs.readFileSync(tmplPath, 'utf8'))
  // Augment plan with compliance markers at top-level metadata
  const infused = { ...planDoc, compliance: { ...(planDoc.compliance||{}), [templateName]: tmpl } }
  const target = outPath || planPath
  fs.writeFileSync(target, yaml.dump(infused))
  return { out: target }
}

if (require.main === module) {
  const tIdx = process.argv.indexOf('--template')
  const pIdx = process.argv.indexOf('--plan')
  if (tIdx < 0 || pIdx < 0) {
    console.error('Usage: node rune-weaver.js --template gdpr|hipaa --plan <path> [--out <path>]')
    process.exit(1)
  }
  const tmpl = process.argv[tIdx+1] as 'gdpr'|'hipaa'
  const plan = process.argv[pIdx+1]
  const oIdx = process.argv.indexOf('--out')
  const out = oIdx > -1 ? process.argv[oIdx+1] : ''
  const res = infusePlan(plan, tmpl, out || undefined)
  console.log('Infused →', res.out)
}