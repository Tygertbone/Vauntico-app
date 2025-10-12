import { computeRiskScore, renderMermaidShadow, collisionPreview } from '../ai/risk'

describe('refined risks', () => {
  it('db-relocation spikes service lock risk and yields preview', () => {
    const actions = [
      { itemPath: 'C:/Program Files/PostgreSQL/16/data', destination: 'D:/Data/Postgres', actionType: 'relocate', sizeBytes: 2 * 1024 * 1024 * 1024, serviceLock: true },
      { itemPath: 'C:/Users/me/AppData/Roaming/npm', destination: 'D:/Dev/Node', actionType: 'link', sizeBytes: 50 * 1024 * 1024 }
    ]
    const risk = computeRiskScore(actions)
    expect(risk.total).toBeGreaterThan(0.1)
    const mmd = renderMermaidShadow(actions as any)
    expect(mmd).toContain('classDef highRisk')
    const preview = collisionPreview([
      { itemPath: 'C:/a', destination: 'D:/Dest' },
      { itemPath: 'C:/b', destination: 'D:/Dest' }
    ])
    expect(preview.length).toBeGreaterThan(0)
  })
})
