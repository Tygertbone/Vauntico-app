import fs from 'fs'
import path from 'path'
import { pairLoreLight } from '../translation/diadem-talisman'

describe('Phase 21: Translation talismans', () => {
  const logPath = path.join(process.cwd(), 'logs', 'translation-diadem.json')

  afterAll(() => { try { fs.unlinkSync(logPath) } catch {} })

  it('pairs lore and light and appends to log', () => {
    const out = pairLoreLight('Cosmic Culmination', 'Final Compliance Setup')
    expect(out.tooltip.lore.includes('Lore')).toBe(true)
    expect(out.tooltip.light.includes('Light')).toBe(true)
    expect(fs.existsSync(logPath)).toBe(true)
  })
})