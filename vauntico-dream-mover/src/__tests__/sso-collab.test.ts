import { ssoCheck } from '../auth/sentinel'
import { shareLib, voteShare } from '../collab/coven-weaver'

describe('SSO sentinel and coven collab', () => {
  it('ssoCheck writes token and returns stub', () => {
    const tok = ssoCheck('google', 'guild@example.com')
    expect(tok.provider).toBe('google')
    expect(typeof tok.token).toBe('string')
  })
  it('coven share and vote reaches approval', () => {
    const e = shareLib('plan-x', 'team-y', 2)
    expect(e.approved).toBe(false)
    voteShare('plan-x','team-y')
    const res = voteShare('plan-x','team-y')
    expect(res && res.approved).toBe(true)
  })
})
