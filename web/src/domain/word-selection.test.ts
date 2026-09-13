import { describe, expect, it } from 'vitest'
import type { WordEntry } from './word'
import { countAvailableWords, getWordCandidates, selectWords, shuffleWords } from './word-selection'

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能干的', note: null },
  { id: 'word-0003', index: 3, word: 'book', phonetic: null, meaning: '书', note: null },
  { id: 'word-0004', index: 4, word: 'zero', phonetic: null, meaning: '零', note: null },
]

describe('word selection', () => {
  it('takes the requested number of unmastered words in source order', () => {
    expect(selectWords({ words, masteredWordIds: ['word-0002'], mode: 'ordered', limit: 2, query: '' }))
      .toEqual([words[0], words[2]])
  })

  it('filters unmastered words by initial letter', () => {
    expect(selectWords({ words, masteredWordIds: [], mode: 'initial', initial: 'A', limit: 8, query: '' }))
      .toEqual([words[0], words[1]])
  })

  it('shows every mastered word regardless of the current batch limit', () => {
    expect(selectWords({ words, masteredWordIds: ['word-0003'], mode: 'mastered', limit: 1, query: '' }))
      .toEqual([words[2]])
  })

  it('returns all mastered matches even when the limit is one', () => {
    expect(selectWords({ words, masteredWordIds: ['word-0001', 'word-0002'], mode: 'mastered', limit: 1, query: '' }))
      .toEqual([words[0], words[1]])
  })

  it('searches both English words and Chinese meanings', () => {
    expect(selectWords({ words, masteredWordIds: [], mode: 'ordered', limit: 8, query: '书' }))
      .toEqual([words[2]])
  })

  it('uses a deterministic seeded shuffle without mutating the source list', () => {
    expect(shuffleWords(words, 23).map((entry) => entry.id))
      .toEqual(shuffleWords(words, 23).map((entry) => entry.id))
    expect(shuffleWords(words, 23).map((entry) => entry.id))
      .not.toEqual(words.map((entry) => entry.id))
    expect(words.map((entry) => entry.id)).toEqual(['word-0001', 'word-0002', 'word-0003', 'word-0004'])
  })

  it('uses deterministic random candidates and rejects an invalid seed', () => {
    const input = { words, masteredWordIds: [], mode: 'random' as const, query: '', shuffleSeed: 23 }
    expect(getWordCandidates(input).map((entry) => entry.id))
      .toEqual(getWordCandidates(input).map((entry) => entry.id))
    expect(() => getWordCandidates({ ...input, shuffleSeed: Number.NaN }))
      .toThrow('单词筛选参数无效。')
  })

  it('counts all candidates before applying the current batch limit', () => {
    expect(countAvailableWords({ words, masteredWordIds: ['word-0002'], mode: 'ordered', limit: 1, query: '' }))
      .toBe(3)
  })

  it('exports all matching candidates without applying a limit', () => {
    expect(getWordCandidates({ words, masteredWordIds: [], mode: 'ordered', query: '' }))
      .toEqual(words)
  })

  it.each([
    { words, masteredWordIds: [], mode: 'ordered' as const, limit: 0, query: '' },
    { words, masteredWordIds: [], mode: 'ordered' as const, limit: 1.5, query: '' },
    { words, masteredWordIds: [], mode: 'initial' as const, initial: '!', limit: 1, query: '' },
  ])('rejects invalid selection parameters', (input) => {
    expect(() => selectWords(input)).toThrow('单词筛选参数无效。')
  })
})
