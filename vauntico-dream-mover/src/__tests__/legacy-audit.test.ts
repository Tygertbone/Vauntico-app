import fs from 'fs'
import path from 'path'
import { personalGrimoire } from '../legacy/lore-linger'
import { soc2Immutable } from '../legacy/audit-abide'

describe('Phase 17: Legacy & Audit', () => {
  const lorePath = path.join(process.cwd(), 'logs', 'personal-lore.json')
  const auditPath = path.join(process.cwd(), 'logs', 'eternal-audit.json')

  afterAll(() => {
    try { fs.unlinkSync(lorePath) } catch {}
    try { fs.unlinkSync(auditPath) } catch {}
  })

  it('appends to personal lore and returns chain YAML', () => {
    const lore = personalGrimoire('sim', 'stub')
    expect(fs.existsSync(lorePath)).toBe(true)
    expect(lore.chains.includes('rollback')).toBe(true)
  })

  it('appends immutable SOC2 audit', () => {
    const rec = soc2Immutable('sim', ['encryption','retention'], true)
    expect(fs.existsSync(auditPath)).toBe(true)
    const arr = JSON.parse(fs.readFileSync(auditPath, 'utf8'))
    expect(Array.isArray(arr)).toBe(true)
    expect(arr[arr.length-1].SOC2.controls.includes('encryption')).toBe(true)
  })
})