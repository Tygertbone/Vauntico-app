import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { hashFolder } from '../verify/hash.js'
import { MigrationDriver, VerifyMode } from '../types/migration-driver.js'
import { relocatePath } from '../migrator/relocate.js'
import { createJunction } from '../migrator/link.js'

export class NodeFsDriver implements MigrationDriver {
  async simulateMove(src: string, dstRoot: string): Promise<{ exists: boolean; sizeBytes: number }> {
    const exists = fs.existsSync(src)
    let sizeBytes = 0
    if (exists) {
      const stat = fs.statSync(src)
      if (stat.isDirectory()) {
        // quick folder size approximation by summing immediate children
        const files = fs.readdirSync(src)
        for (const f of files.slice(0, 50)) {
          const p = path.join(src, f)
          try { sizeBytes += fs.statSync(p).size } catch { /* noop */ }
        }
      } else {
        sizeBytes = stat.size
      }
    }
    return { exists, sizeBytes }
  }

  async relocate(src: string, dstRoot: string): Promise<void> {
    await relocatePath(src, dstRoot)
  }

  async createLink(src: string, dstRoot: string): Promise<void> {
    // On Windows, create junction at src pointing to relocated path (dstRoot)
    createJunction(src, dstRoot)
  }

  async verifyHash(p: string, mode: VerifyMode): Promise<string | ''> {
    if (!fs.existsSync(p) || !fs.statSync(p).isDirectory()) return ''
    if (mode === 'none') return ''
    if (mode === 'sample') {
      const { hashFolderSample } = await import('../verify/hash.js')
      return hashFolderSample(p)
    }
    return hashFolder(p)
  }
}

export const getDriver = () => new NodeFsDriver()
