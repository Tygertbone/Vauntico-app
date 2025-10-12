import fs from 'fs'
import path from 'path'
import { calcNps, postRiteSurvey } from '../beta/loop-weaver'
import { vercelStub } from '../launch/polish-pal'

describe('Phase 14: Beta & Polish', () => {
  const logsDir = path.join(process.cwd(), 'logs')
  const fbPath = path.join(logsDir, 'feedback-loops.json')
  const vePath = path.join(logsDir, 'vercel-env.json')

  afterAll(() => {
    try { fs.unlinkSync(fbPath) } catch {}
    try { fs.unlinkSync(vePath) } catch {}
  })

  it('computes strong NPS/avg from high scores and writes logs', () => {
    const res1 = postRiteSurvey('sim', 9)
    const res2 = postRiteSurvey('sim', 10)
    expect(res2.avg).toBeGreaterThan(8)
    expect(typeof res2.nps).toBe('number')
    expect(fs.existsSync(fbPath)).toBe(true)
  })

  it('writes vercel env with beta palette', () => {
    const env = vercelStub(true)
    expect(env.DM_BETA).toBe(true)
    const file = JSON.parse(fs.readFileSync(vePath, 'utf8'))
    expect(file.DM_BETA).toBe(true)
    expect(file.palette).toBeTruthy()
  })
})