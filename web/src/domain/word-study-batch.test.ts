import { describe, expect, it } from 'vitest'
import type { WordEntry } from './word'
import {
  completeWordInBatch,
  createWordStudyBatch,
  selectBatchWords,
} from './word-study-batch'

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能够', note: null },
  { id: 'word-0003', index: 3, word: 'book', phonetic: null, meaning: '书', note: null },
  { id: 'word-0004', index: 4, word: 'zero', phonetic: null, meaning: '零', note: null },
]

describe('word study batch', () => {
  it('freezes the requested ordered words and never replenishes after mastery', () => {
    const result = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'ordered' },
    })
    expect(result.batch.wordIds).toEqual(['word-0001', 'word-0002'])
    expect(result.batch.remainingWordIds).toEqual(['word-0001', 'word-0002'])

    const next = completeWordInBatch(result.batch, 'word-0001')
    expect(next.remainingWordIds).toEqual(['word-0002'])
    expect(next.remainingWordIds).not.toContain('word-0003')
  })

  it('uses the actual candidate count when a letter has fewer words than the goal', () => {
    const result = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 30,
      rule: { kind: 'initial', initial: 'Z' },
    })
    expect(result.availableCount).toBe(1)
    expect(result.batch.requestedSize).toBe(30)
    expect(result.batch.actualSize).toBe(1)
    expect(result.batch.wordIds).toEqual(['word-0004'])
  })

  it('searches only remaining words from the frozen batch', () => {
    const batch = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'ordered' },
    }).batch
    expect(selectBatchWords(batch, words, '书')).toEqual([])
    expect(selectBatchWords(batch, words, '能力').map((entry) => entry.id)).toEqual(['word-0001'])
  })

  it('rejects invalid sizes and letters', () => {
    expect(() => createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 0,
      rule: { kind: 'ordered' },
    })).toThrow('单词批次参数无效。')
    expect(() => createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'initial', initial: '!' },
    })).toThrow('单词批次参数无效。')
  })
})
