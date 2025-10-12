import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function createLogServer(opts: { logsDir?: string, port?: number } = {}) {
  const app = express()
  const logs = path.resolve(__dirname, '../../logs')
  const dir = opts.logsDir || logs
  const port = opts.port || 3000
  app.use('/dm-logs', express.static(dir))
  const server = app.listen(port, () => {
    console.log(`Log server at http://localhost:${port}/dm-logs (serving ${dir})`)
  })
  return server
}

if (process.env.DM_LOG_SERVER === '1') {
  createLogServer()
}
