import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { realNgrokVercel } from '../scale/elevation-ts'
import { legacyOnboard } from '../cosmic/culminate-exalt'

describe('Phase 19: Live & Cosmic', () => {
  const logs = path.join(process.cwd(), 'logs')
  const scalePath = path.join(logs, 'scale-live.json')
  const closePath = path.join(logs, 'cosmic-close.yml')
  const teachPath = path.join(logs, 'nexus-teach.yml')

  afterAll(() => {
    try { fs.unlinkSync(scalePath) } catch {}
    try { fs.unlinkSync(closePath) } catch {}
  })

  it('writes scale-live with DM_SCALE', () => {
    const res = realNgrokVercel('za')
    const data = JSON.parse(fs.readFileSync(scalePath, 'utf8'))
    expect(data.DM_SCALE).toBe(true)
    expect(typeof data.link).toBe('string')
    expect(typeof data.vercel).toBe('string')
  })

  it('writes cosmic-close and appends chain to nexus-teach', () => {
    // Ensure teach exists
    try { fs.writeFileSync(teachPath, 'from: C:\n', 'utf8') } catch {}
    const res = legacyOnboard('C:D:', 'sim')
    const y = fs.readFileSync(closePath, 'utf8')
    expect(y.includes('steps')).toBe(true)
    const teach = fs.readFileSync(teachPath, 'utf8')
    expect(teach.includes('cosmicChain')).toBe(true)
  })
})