import fs from 'fs'
import path from 'path'

export interface RitesMetric {
  ts: string
  cpuPct: number
  memMB: number
  ritesPerMin: number
}

export function metricCollect(): RitesMetric {
  const ts = new Date().toISOString()
  const cpuPct = Math.round(Math.random() * 30)
  const memMB = 512 + Math.round(Math.random() * 512)
  const ritesPerMin = 1 + Math.round(Math.random() * 5)
  return { ts, cpuPct, memMB, ritesPerMin }
}

export function writeMetricSample(outPath = path.join('vauntico-dream-mover','logs','monitor-metrics.json')) {
  const m = metricCollect()
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  const arr: RitesMetric[] = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath,'utf8')) : []
  arr.push(m)
  fs.writeFileSync(outPath, JSON.stringify(arr, null, 2))
  return { out: outPath, last: m }
}
