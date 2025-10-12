import fs from 'fs'
import path from 'path'
import { i18nWeave } from '../global/sigil-gilder'
import { shareRite } from '../viral/vector-gale'

describe('Phase 15: Global & Viral', () => {
  const plan = path.join(process.cwd(), 'vauntico-dream-mover/plans/docker-volumes.sample.yml')
  const outAf = plan.replace(/\.ya?ml$/i, '.af.yml')
  const viralPath = path.join(process.cwd(), 'logs/viral-vectors.json')

  afterAll(() => {
    try { fs.unlinkSync(outAf) } catch {}
    try { fs.unlinkSync(viralPath) } catch {}
  })

  it('weaves Afrikaans i18n into plan', () => {
    const res = i18nWeave(plan, 'af')
    expect(res.out.endsWith('.af.yml')).toBe(true)
    expect(fs.existsSync(res.out)).toBe(true)
  })

  it('appends viral share log', () => {
    const entry = shareRite('sim', 'x')
    expect(entry.platform).toBe('x')
    expect(fs.existsSync(viralPath)).toBe(true)
    const arr = JSON.parse(fs.readFileSync(viralPath, 'utf8'))
    expect(Array.isArray(arr)).toBe(true)
    expect(arr.length).toBeGreaterThan(0)
  })
})