import fs from 'fs'
import path from 'path'
import { webhookLive } from '../integrations/webhook-link'
import { multiRegionDeploy } from '../scale/elevation-ts'

describe('Phase 16: Live & Scale (dry-run safe)', () => {
  const livePath = path.join(process.cwd(), 'logs', 'live-flip.json')
  const elevPath = path.join(process.cwd(), 'logs', 'scale-elev.json')

  afterAll(() => {
    try { fs.unlinkSync(livePath) } catch {}
    try { fs.unlinkSync(elevPath) } catch {}
  })

  it('webhook-live flips tier in logs', () => {
    const res = webhookLive('create', 'mock', 6)
    expect(fs.existsSync(livePath)).toBe(true)
    const log = JSON.parse(fs.readFileSync(livePath, 'utf8'))
    expect(log.tierAfter === 'Practitioner' || log.tierAfter === 'Seeker').toBe(true)
  })

  it('scale-elevate writes metrics for ZA', () => {
    const res = multiRegionDeploy('za')
    expect(res.metrics.regions).toBeGreaterThanOrEqual(1)
    expect(fs.existsSync(elevPath)).toBe(true)
  })
})