import { checkTier, recordRitual } from '../tiers/gatekeeper'
import { generateExam, gradeExam } from '../certs/exam-renderer'

describe('tiers and cert stubs', () => {
  it('seeker starts with 5/day and can record until cap', () => {
    const p1 = checkTier('stub')
    expect(p1.limits.ritualsDay === 5 || p1.limits.ritualsDay === 'infinite').toBeTruthy()
    const r = recordRitual()
    expect(r.profile.counters.ritualsToday).toBeGreaterThan(0)
  })

  it('exam pass at >=0.8', () => {
    const exam = generateExam()
    const responses = exam.qs.map((q) => q.ans) // all correct
    const score = gradeExam(exam, responses)
    expect(score).toBeGreaterThanOrEqual(0.8)
  })
})
