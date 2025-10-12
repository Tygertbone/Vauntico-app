export interface RiskScore {
  total: number
  factors: string[]
}

export interface ShadowNode {
  id: string
  label: string
  color?: string
}

export interface ShadowEdge {
  from: string
  to: string
  label?: string
}

export const computeRiskScore = (actions: Array<{ itemPath: string, destination: string, actionType: string, sizeBytes?: number }>): RiskScore => {
  const uniqueDestRoots = new Set(actions.map(a => a.destination))
  const totalSize = actions.reduce((acc, a) => acc + (a.sizeBytes || 0), 0)
  const sizeGB = totalSize / (1024 ** 3)
  const collisionRisk = Math.max(0, (actions.length - uniqueDestRoots.size)) * 0.01
  const sizeRisk = Math.min(1, sizeGB * 0.02)
  const total = Math.min(1, +(collisionRisk + sizeRisk).toFixed(2))
  const factors = [] as string[]
  if (collisionRisk) factors.push(`pathCollision:${collisionRisk.toFixed(2)}`)
  if (sizeRisk) factors.push(`sizeOverrun:${sizeRisk.toFixed(2)}`)
  return { total, factors }
}

export const renderMermaidShadow = (actions: Array<{ itemPath: string, destination: string, actionType: string }>): string => {
  const lines: string[] = []
  lines.push('graph TD')
  const nodes = new Set<string>()
  for (const a of actions.slice(0, 100)) {
    const srcId = a.itemPath.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    const dstId = a.destination.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    if (!nodes.has(srcId)) {
      lines.push(`${srcId}["${a.itemPath}"]`)
      nodes.add(srcId)
    }
    if (!nodes.has(dstId)) {
      lines.push(`${dstId}["${a.destination}"]`)
      nodes.add(dstId)
    }
    const label = a.actionType === 'link' ? 'link' : (a.actionType === 'relocate' ? 'move' : a.actionType)
    lines.push(`${srcId} -->|${label}| ${dstId}`)
  }
  return lines.join('\n')
}
