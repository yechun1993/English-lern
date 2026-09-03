import { describe, expect, it } from 'vitest'
import { LocalStudyRepository, type StorageLike } from './study-repository'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }
}

describe('LocalStudyRepository', () => {
  it('keeps attempts, drafts, review state, and pending sync events locally', () => {
    const repository = new LocalStudyRepository(new MemoryStorage())

    repository.recordAttempt({
      id: 'attempt-001',
      questionId: 'grammar-001',
      answer: 'is',
      correct: true,
      guessed: false,
      createdAt: '2026-09-01T00:00:00.000Z',
    })
    repository.saveDraft({
      questionId: 'writing-001',
      content: 'I would like to share my study plan.',
      updatedAt: '2026-09-01T00:10:00.000Z',
    })

    expect(repository.getDashboard()).toMatchObject({
      attemptCount: 1,
      correctCount: 1,
      pendingCount: 2,
    })
    expect(repository.listDueReviews(new Date('2026-09-02T00:00:00.000Z'))).toEqual([
      expect.objectContaining({ questionId: 'grammar-001' }),
    ])
    expect(repository.getDraft('writing-001')).toMatchObject({
      content: 'I would like to share my study plan.',
    })
  })

  it('clears only pending events after a successful sync handoff', () => {
    const repository = new LocalStudyRepository(new MemoryStorage())
    repository.recordAttempt({
      id: 'attempt-001',
      questionId: 'grammar-001',
      answer: 'is',
      correct: true,
      guessed: false,
      createdAt: '2026-09-01T00:00:00.000Z',
    })

    const pending = repository.listPending()
    repository.flushPending(pending.map((event) => event.id))

    expect(repository.getDashboard().pendingCount).toBe(0)
    expect(repository.getMastery('grammar-001')).toMatchObject({ status: 'learning' })
  })

  it('treats a guessed correct answer as needing review', () => {
    const repository = new LocalStudyRepository(new MemoryStorage())
    repository.recordAttempt({
      id: 'attempt-guessed-001',
      questionId: 'grammar-001',
      answer: 'is',
      correct: true,
      guessed: true,
      createdAt: '2026-09-01T00:00:00.000Z',
    })

    expect(repository.getMastery('grammar-001')).toMatchObject({
      status: 'learning',
      correctReviewDays: [],
    })
  })
})
