import { computeRiskScore } from '../ai/risk'

describe('AI stubs', () => {
  it('risk score remains low for small plans', () => {
    const actions = [
      { itemPath: 'C:/Users/me/AppData/Roaming/npm', destination: 'D:/Dev/Node', actionType: 'link', sizeBytes: 50 * 1024 * 1024 },
      { itemPath: 'C:/Users/me/AppData/Local/pnpm/store', destination: 'D:/Dev/pnpm', actionType: 'link', sizeBytes: 200 * 1024 * 1024 }
    ]
    const risk = computeRiskScore(actions)
    expect(risk.total).toBeLessThan(0.1)
    expect(Array.isArray(risk.factors)).toBe(true)
  })
})
