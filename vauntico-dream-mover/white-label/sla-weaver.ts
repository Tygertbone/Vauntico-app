import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export function generateSLA(custom: { org: string, soc2?: boolean, uptime?: string }) {
  const doc = {
    organization: custom.org,
    soc2: !!custom.soc2,
    uptime: custom.uptime || '99.9%'
  }
  return yaml.dump(doc)
}

export function writeSLA(outPath: string, contents: string) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, contents)
}