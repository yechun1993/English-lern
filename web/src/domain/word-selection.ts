import type { WordBrowseMode, WordEntry } from './word'

export interface WordSelectionInput {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  mode: WordBrowseMode
  initial?: string
  query: string
  limit: number
  shuffleSeed?: number
}

const INVALID_SELECTION_MESSAGE = '单词筛选参数无效。'

function validateInput(input: WordSelectionInput) {
  if (!Number.isInteger(input.limit) || input.limit <= 0) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }

  if (input.mode === 'initial' && !/^[A-Z]$/.test(input.initial ?? '')) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }

  if (input.shuffleSeed !== undefined && !Number.isFinite(input.shuffleSeed)) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }
}

function mulberry32(seed: number) {
  let state = seed >>> 0

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleWords(words: readonly WordEntry[], seed: number): WordEntry[] {
  const shuffled = [...words]
  const random = mulberry32(seed)

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

function getCandidates(input: WordSelectionInput): WordEntry[] {
  validateInput(input)
  const mastered = new Set(input.masteredWordIds)
  let candidates = input.mode === 'mastered'
    ? input.words.filter((entry) => mastered.has(entry.id))
    : input.words.filter((entry) => !mastered.has(entry.id))

  if (input.mode === 'initial') {
    candidates = candidates.filter((entry) => entry.word[0]?.toUpperCase() === input.initial)
  }

  if (input.mode === 'random') {
    candidates = shuffleWords(candidates, input.shuffleSeed ?? 0)
  }

  const normalizedQuery = input.query.trim().toLowerCase()
  if (normalizedQuery) {
    candidates = candidates.filter((entry) => (
      entry.word.toLowerCase().includes(normalizedQuery)
      || entry.meaning.toLowerCase().includes(normalizedQuery)
    ))
  }

  return candidates
}

export function selectWords(input: WordSelectionInput): WordEntry[] {
  const candidates = getCandidates(input)
  return input.mode === 'mastered' ? candidates : candidates.slice(0, input.limit)
}

export function countAvailableWords(input: WordSelectionInput): number {
  return getCandidates(input).length
}
