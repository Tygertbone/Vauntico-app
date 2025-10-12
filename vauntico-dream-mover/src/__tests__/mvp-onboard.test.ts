import fs from 'fs'
import path from 'path'
import { vercelRealDeploy } from '../launch/polish-pal'
import { spaceWhisper } from '../onboarding/nexus-call'

describe('Phase 18: MVP & Onboarding', () => {
  const logsDir = path.join(process.cwd(), 'logs')
  const mvpPath = path.join(logsDir, 'mvp-deploy.json')
  const teachPath = path.join(logsDir, 'nexus-teach.yml')

  afterAll(() => {
    try { fs.unlinkSync(mvpPath) } catch {}
    try { fs.unlinkSync(teachPath) } catch {}
  })

  it('writes MVP deploy log with DM_LAUNCH', () => {
    const res = vercelRealDeploy('beta')
    const data = JSON.parse(fs.readFileSync(mvpPath, 'utf8'))
    expect(data.DM_LAUNCH).toBe(true)
    expect(typeof data.link).toBe('string')
  })

  it('writes nexus teaching yaml', () => {
    const out = spaceWhisper('C:', 'D:')
    const y = fs.readFileSync(teachPath, 'utf8')
    expect(y.includes('safeMoves')).toBe(true)
  })
})