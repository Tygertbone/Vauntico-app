import fs from 'fs'
import path from 'path'
import { uploadPlan } from '../marketplace/full-bazaar.js'

export function launchUpload(planPath: string, userId: string, priceUSD: number, caseStudy: string) {
  const entry = uploadPlan(planPath, userId, priceUSD)
  const casePath = path.join('vauntico-dream-mover','marketplace','case-studies.md')
  fs.mkdirSync(path.dirname(casePath), { recursive: true })
  const gumroadUrl = `https://gumroad.com/l/${path.basename(planPath).replace(/\W+/g,'-')}`
  const block = `\n\n## Case: ${path.basename(planPath)}\n- Uploaded by: ${userId}\n- Price: $${priceUSD} (commission: $${entry.commissionUSD})\n- Link: ${gumroadUrl}\n\n${caseStudy}\n`
  fs.appendFileSync(casePath, block)
  return { entry, gumroadUrl, casePath }
}
