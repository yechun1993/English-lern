import { describe, expect, it } from 'vitest'
import { calculateReadiness, createInitialMastery, recordAttempt } from './mastery'

const firstDay = new Date('2026-09-01T00:00:00.000Z')

describe('recordAttempt', () => {
  it('moves a new question into learning after one correct review day', () => {
    const result = recordAttempt(createInitialMastery(), true, firstDay)

    expect(result).toMatchObject({
      status: 'learning',
      correctStreak: 1,
      correctReviewDays: ['2026-09-01'],
      intervalDays: 1,
      nextReviewAt: '2026-09-02T00:00:00.000Z',
    })
  })

  it('marks a question mastered only after three correct answers on different review days', () => {
    const afterFirstCorrect = recordAttempt(createInitialMastery(), true, firstDay)
    const afterSecondCorrect = recordAttempt(
      afterFirstCorrect,
      true,
      new Date('2026-09-02T00:00:00.000Z'),
    )
    const result = recordAttempt(afterSecondCorrect, true, new Date('2026-09-05T00:00:00.000Z'))

    expect(result).toMatchObject({
      status: 'mastered',
      correctStreak: 3,
      correctReviewDays: ['2026-09-01', '2026-09-02', '2026-09-05'],
      intervalDays: 14,
      nextReviewAt: '2026-09-19T00:00:00.000Z',
    })
  })

  it('does not count two correct answers on the same review day twice', () => {
    const afterFirstCorrect = recordAttempt(createInitialMastery(), true, firstDay)
    const result = recordAttempt(afterFirstCorrect, true, new Date('2026-09-01T08:00:00.000Z'))

    expect(result).toMatchObject({
      status: 'learning',
      correctStreak: 1,
      correctReviewDays: ['2026-09-01'],
      intervalDays: 1,
    })
  })

  it('resets the streak and schedules a near review after a wrong answer', () => {
    const learned = recordAttempt(createInitialMastery(), true, firstDay)
    const result = recordAttempt(learned, false, new Date('2026-09-02T00:00:00.000Z'))

    expect(result).toMatchObject({
      status: 'learning',
      correctStreak: 0,
      correctReviewDays: [],
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
