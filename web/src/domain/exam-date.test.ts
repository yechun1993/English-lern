import { describe, expect, it } from 'vitest'
import { daysUntilExam } from './exam-date'

describe('daysUntilExam', () => {
  it('counts calendar days rather than the remaining hours of today', () => {
    expect(daysUntilExam(new Date(2026, 8, 3, 23, 59))).toBe(44)
  })

  it('never shows a negative countdown after the exam date', () => {
    expect(daysUntilExam(new Date(2026, 9, 17, 12))).toBe(0)
    expect(daysUntilExam(new Date(2026, 9, 18))).toBe(0)
  })
})
