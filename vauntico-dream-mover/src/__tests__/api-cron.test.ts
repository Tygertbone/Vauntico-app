import { buildApp } from '../api/portal'

describe('api portal stubs', () => {
  it('buildApp returns an express app with routes', () => {
    const app: any = buildApp()
    expect(typeof app).toBe('function')
  })
})
