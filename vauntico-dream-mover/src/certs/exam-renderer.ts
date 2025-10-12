export interface ExamQuestion { q: string, opts: string[], ans: number }
export interface Exam { qs: ExamQuestion[], score?: number }

export function generateExam(): Exam {
  return {
    qs: [
      { q: 'Rollback rite is performed using which artifact?', opts: ['manifest.json','shadow-map.mmd','report.json'], ans: 0 },
      { q: 'Safer default verify mode?', opts: ['none','sample','hash'], ans: 2 },
      { q: 'First step of any ritual?', opts: ['migrate','simulate','rollback'], ans: 1 },
    ]
  }
}

export function gradeExam(exam: Exam, responses: number[]): number {
  const correct = exam.qs.reduce((acc, q, i) => acc + (responses[i] === q.ans ? 1 : 0), 0)
  return +(correct / exam.qs.length).toFixed(2)
}