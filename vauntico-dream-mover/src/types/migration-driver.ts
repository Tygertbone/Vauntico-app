export type VerifyMode = 'none' | 'sample' | 'hash'

export interface MigrationAction {
  itemPath: string
  destination: string
  actionType: 'relocate' | 'link' | 'rehome_app'
  actionOptions?: Record<string, any>
  verifyMode?: VerifyMode
}

export interface MigrationDriver {
  simulateMove(src: string, dst: string): Promise<{ exists: boolean, sizeBytes: number }>
  relocate(src: string, dstRoot: string): Promise<void>
  createLink(src: string, dstRoot: string): Promise<void>
  verifyHash(path: string, mode: VerifyMode): Promise<string | ''>
  verifyPermissions(p: string, kind?: Array<'read'|'write'|'exec'>): Promise<{ granted: boolean, hurdles: string[] }>
}
