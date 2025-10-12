import { getRustDriver } from '../runtime/rust-bridge'

describe('rust stride gating', () => {
  it('respects DM_USE_RUST flag and remains safe when disabled', async () => {
    delete process.env.DM_USE_RUST
    const drv = await getRustDriver()
    expect(drv.available).toBe(false)
  })
})
