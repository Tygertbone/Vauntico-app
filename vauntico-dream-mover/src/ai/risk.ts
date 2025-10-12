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

export const computeRiskScore = (actions: Array<{ itemPath: string, destination: string, actionType: string, sizeBytes?: number, serviceLock?: boolean }>): RiskScore => {
  const uniqueDestRoots = new Set(actions.map(a => a.destination))
  const totalSize = actions.reduce((acc, a) => acc + (a.sizeBytes || 0), 0)
  const sizeGB = totalSize / (1024 ** 3)
  const overlaps = Math.max(0, (actions.length - uniqueDestRoots.size))
  const serviceLocks = actions.filter(a => /postgres|docker/i.test(a.itemPath) || a.serviceLock).length
  const collisionRisk = overlaps * 0.01
  const sizeRisk = Math.min(1, sizeGB * 0.02)
  const serviceRisk = Math.min(1, serviceLocks * 0.07)
  const total = Math.min(1, +(collisionRisk + sizeRisk + serviceRisk).toFixed(2))
  const factors = [] as string[]
  if (collisionRisk) factors.push(`pathCollision:${collisionRisk.toFixed(2)}`)
  if (sizeRisk) factors.push(`sizeOverrun:${sizeRisk.toFixed(2)}`)
  if (serviceRisk) factors.push(`serviceLocks:${serviceRisk.toFixed(2)}`)
  return { total, factors }
}

export const renderMermaidShadow = (actions: Array<{ itemPath: string, destination: string, actionType: string }>): string => {
  const lines: string[] = []
  lines.push('graph TD')
  lines.push('classDef lowRisk fill:#90ee90,color:#000;')
  lines.push('classDef highRisk fill:#ff0000,color:#fff;')
  const nodes = new Set<string>()
  const dstCounts: Record<string, number> = {}
  const dstIdMap: Record<string, string> = {}
  for (const a of actions.slice(0, 100)) {
    const srcId = a.itemPath.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    const dstId = a.destination.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
    dstCounts[dstId] = (dstCounts[dstId] || 0) + 1
    dstIdMap[dstId] = a.destination
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
  // annotate high-risk destinations if multiple sources converge
  Object.keys(dstCounts).forEach(id => {
    if (dstCounts[id] > 1) {
      lines.push(`class ${id} highRisk`)
    } else {
      lines.push(`class ${id} lowRisk`)
    }
  })
  return lines.join('\n')
}

export const collisionPreview = (actions: Array<{ itemPath: string, destination: string }>): string[] => {
  const byDest: Record<string, string[]> = {}
  for (const a of actions) {
    byDest[a.destination] = byDest[a.destination] || []
    byDest[a.destination].push(a.itemPath)
  }
  const previews: string[] = []
  for (const [dest, paths] of Object.entries(byDest)) {
    if (paths.length > 1) {
      previews.push(`${paths.length} sources converge on ${dest}`)
    }
  }
  return previews
}
