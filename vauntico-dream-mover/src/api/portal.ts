import express from 'express'
import fs from 'fs'
import path from 'path'

export function buildApp() {
  const app = express()
  app.use(express.json())

  // Simple auth check: require ssoToken header (stub) if present in logs
  app.use((req, res, next) => {
    // In future, validate against logs/sso-token.json
    next()
  })

  app.post('/sim', (req, res) => {
    const plan = req.body?.plan || 'unknown'
    const out = path.join('vauntico-dream-mover','logs','api.log')
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.appendFileSync(out, `[SIM] ${new Date().toISOString()} plan=${plan}\n`)
    res.json({ ok: true, message: 'Simulation queued (stub)', plan })
  })

  app.get('/manifest', (req, res) => {
    const manifestPath = path.join('vauntico-dream-mover','logs','manifest.json')
    if (fs.existsSync(manifestPath)) {
      res.type('application/json').send(fs.readFileSync(manifestPath, 'utf8'))
    } else {
      res.status(404).json({ ok: false, error: 'No manifest found' })
    }
  })

  app.post('/rune-infuse', (req, res) => {
    const plan = req.body?.plan
    const template = req.body?.template || 'gdpr'
    if (!plan) return res.status(400).json({ ok: false, error: 'Missing plan' })
    const out = path.join('vauntico-dream-mover','logs','api.log')
    fs.appendFileSync(out, `[INFUSE] ${new Date().toISOString()} plan=${plan} template=${template}\n`)
    res.json({ ok: true, message: 'Infusion scheduled (stub)', plan, template })
  })

  return app
}

export function serve(port = 3001) {
  const app = buildApp()
  return app.listen(port, () => console.log(`API portal listening on http://localhost:${port}`))
}