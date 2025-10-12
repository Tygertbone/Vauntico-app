import fs from 'fs'
import path from 'path'

export interface SsoToken { provider: 'google'|'azure', email: string, token: string, ts: string }

export function ssoCheck(provider: 'google'|'azure', email: string): SsoToken {
  const ts = new Date().toISOString()
  const token = Buffer.from(`${provider}:${email}:${ts}`).toString('base64')
  const sso: SsoToken = { provider, email, token, ts }
  const out = path.join('vauntico-dream-mover','logs','sso-token.json')
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, JSON.stringify(sso, null, 2))
  return sso
}