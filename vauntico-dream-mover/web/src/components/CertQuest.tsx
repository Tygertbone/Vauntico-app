import React, { useMemo, useState } from 'react'
import { generateExam, gradeExam } from '../../src/certs/exam-renderer'

export function CertQuest() {
  const exam = useMemo(() => generateExam(), [])
  const [responses, setResponses] = useState<number[]>(Array(exam.qs.length).fill(-1))
  const [score, setScore] = useState<number|undefined>(undefined)

  return (
    <div style={{ border: '1px dashed #555', padding: 12, borderRadius: 8 }}>
      <h3>Earn the Adept Badge</h3>
      {exam.qs.map((q, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <div>{idx+1}. {q.q}</div>
          <div>
            {q.opts.map((opt, i) => (
              <label key={i} style={{ marginRight: 12 }}>
                <input type="radio" name={`q${idx}`} checked={responses[idx]===i} onChange={() => {
                  const next = responses.slice(); next[idx] = i; setResponses(next)
                }} /> {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300" onClick={() => {
        const s = gradeExam(exam, responses); setScore(s)
        alert(s >= 0.8 ? `Passed: ${s}` : `Try again: ${s}`)
      }}>Submit</button>
      {score !== undefined && (
        <div style={{ marginTop: 8 }}>
          Result: {score} {score >= 0.8 ? '— Adept Badge granted (stub)' : ''}
        </div>
      )}
    </div>
  )
}