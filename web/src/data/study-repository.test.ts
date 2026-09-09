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

  it('persists a deduplicated mastered-word queue without changing question metrics', () => {
    const storage = new MemoryStorage()
    const repository = new LocalStudyRepository(storage)

    repository.markWordMastered('word-0001')
    repository.markWordMastered('word-0001')
    repository.markWordMastered('word-0002')

    expect(repository.listMasteredWordIds()).toEqual(['word-0001', 'word-0002'])
    expect(repository.getDashboard()).toMatchObject({ attemptCount: 0, correctCount: 0, dueReviewCount: 0 })
    expect(new LocalStudyRepository(storage).listMasteredWordIds()).toEqual(['word-0001', 'word-0002'])
  })

  it('accepts existing v1 study data that has no mastered-word field', () => {
    const storage = new MemoryStorage()
    storage.setItem('legacy', JSON.stringify({ attempts: [], drafts: {}, masteryByQuestion: {}, pending: [] }))

    const repository = new LocalStudyRepository(storage, 'legacy')
    expect(repository.listMasteredWordIds()).toEqual([])
    repository.markWordMastered('word-0003')
    repository.unmarkWordMastered('word-0003')
    expect(repository.listMasteredWordIds()).toEqual([])
  })
})
