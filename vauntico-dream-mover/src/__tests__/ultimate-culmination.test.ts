import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { vercelUltimateDeploy } from '../launch/polish-pal'
import { eternalBlitzChain } from '../culmination/cosmic-culminate'

describe('Phase 21: Ultimate & Culmination', () => {
  const logs = path.join(process.cwd(), 'logs')
  const ultimatePath = path.join(logs, 'ultimate-polish.json')
  const culminatePath = path.join(logs, 'eternal-culminate.yml')

  afterAll(() => {
    try { fs.unlinkSync(ultimatePath) } catch {}
    try { fs.unlinkSync(culminatePath) } catch {}
  })

  it('writes ultimate-polish with DM_ULTIMATE and multi-lang', () => {
    const res = vercelUltimateDeploy('beta')
    const data = JSON.parse(fs.readFileSync(ultimatePath, 'utf8'))
    expect(data.DM_ULTIMATE).toBe(true)
    expect(Object.keys(data.i18n || {}).length).toBeGreaterThanOrEqual(5)
    expect(Array.isArray(data.regions)).toBe(true)
  })

  it('writes eternal-culminate chain yaml', () => {
    const res = eternalBlitzChain('C:D:', 'x', 'sim')
    const y = fs.readFileSync(culminatePath, 'utf8')
    expect(y.includes('steps')).toBe(true)
    expect(y.includes('legacy')).toBe(true)
  })
})