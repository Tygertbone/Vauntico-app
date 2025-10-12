import { getDriver } from '../runtime/bridge'

describe('driver parity', () => {
  it('windows junction vs unix symlink behavior selection (smoke)', async () => {
    const driver = getDriver()
    // We won’t actually create links here; just assert method presence as parity gate.
    expect(typeof driver.createLink).toBe('function')
    expect(typeof driver.relocate).toBe('function')
    const perms = await driver.verifyPermissions(process.cwd(), ['read'])
    expect(perms.granted).toBe(true)
  })
})
