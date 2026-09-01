import { describe, expect, it } from 'vitest'
import { calculateReadiness, createInitialMastery, recordAttempt } from './mastery'

const firstDay = new Date('2026-09-01T00:00:00.000Z')

describe('recordAttempt', () => {
  it('moves a new question into learning after one correct answer', () => {
    const result = recordAttempt(createInitialMastery(), true, firstDay)

    expect(result).toMatchObject({
      status: 'learning',
      correctStreak: 1,
      intervalDays: 1,
      nextReviewAt: '2026-09-02T00:00:00.000Z',
    })
  })

  it('moves a question to review after two consecutive correct answers', () => {
    const afterFirstCorrect = recordAttempt(createInitialMastery(), true, firstDay)
    const result = recordAttempt(afterFirstCorrect, true, new Date('2026-09-02T00:00:00.000Z'))

    expect(result).toMatchObject({
      status: 'review',
      correctStreak: 2,
      intervalDays: 3,
      nextReviewAt: '2026-09-05T00:00:00.000Z',
    })
  })

  it('resets the streak and schedules a near review after a wrong answer', () => {
    const learned = recordAttempt(createInitialMastery(), true, firstDay)
    const result = recordAttempt(learned, false, new Date('2026-09-02T00:00:00.000Z'))

    expect(result).toMatchObject({
      status: 'learning',
      correctStreak: 0,
      intervalDays: 1,
      nextReviewAt: '2026-09-03T00:00:00.000Z',
    })
  })
})

describe('calculateReadiness', () => {
  it('converts five module accuracies into an exam-like predicted score', () => {
    const result = calculateReadiness({
      grammar: { correct: 14, total: 20 },
      cloze: { correct: 13, total: 20 },
      reading: { correct: 6, total: 8 },
      translation: { correct: 10, total: 20 },
      writing: { correct: 12, total: 20 },
    })

    expect(result.predictedScore).toBe(64)
    expect(result.isOnTrack).toBe(true)
    expect(result.moduleScores.grammar).toBe(14)
    expect(result.moduleScores.reading).toBe(15)
  })
})
