import { getWordCandidates } from './word-selection'
import type { WordEntry } from './word'

export type WordBatchRule =
  | { kind: 'ordered' }
  | { kind: 'random'; seed: number }
  | { kind: 'initial'; initial: string }

export interface WordStudyBatch {
  requestedSize: number
  actualSize: number
  rule: WordBatchRule
  wordIds: readonly string[]
  remainingWordIds: readonly string[]
}

interface CreateWordStudyBatchInput {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  requestedSize: number
  rule: WordBatchRule
}

const INVALID_BATCH_MESSAGE = '单词批次参数无效。'

export function createWordStudyBatch(input: CreateWordStudyBatchInput) {
  if (!Number.isInteger(input.requestedSize) || input.requestedSize <= 0) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }
  if (input.rule.kind === 'initial' && !/^[A-Z]$/.test(input.rule.initial)) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }

  const mode = input.rule.kind === 'initial' ? 'initial' : input.rule.kind
  const candidates = getWordCandidates({
    words: input.words,
    masteredWordIds: input.masteredWordIds,
    mode,
    initial: input.rule.kind === 'initial' ? input.rule.initial : undefined,
    query: '',
    shuffleSeed: input.rule.kind === 'random' ? input.rule.seed : undefined,
  })
  const selected = candidates.slice(0, input.requestedSize)
  const wordIds = selected.map((entry) => entry.id)
  return {
    availableCount: candidates.length,
    batch: {
      requestedSize: input.requestedSize,
      actualSize: wordIds.length,
      rule: input.rule,
      wordIds,
      remainingWordIds: wordIds,
    } satisfies WordStudyBatch,
  }
}

export function completeWordInBatch(batch: WordStudyBatch, wordId: string): WordStudyBatch {
  if (!batch.wordIds.includes(wordId)) return batch
  return {
    ...batch,
    remainingWordIds: batch.remainingWordIds.filter((id) => id !== wordId),
  }
}

export function selectBatchWords(
  batch: WordStudyBatch,
  words: readonly WordEntry[],
  query: string,
): WordEntry[] {
  const wordsById = new Map(words.map((entry) => [entry.id, entry]))
  const normalized = query.trim().toLowerCase()
  return batch.remainingWordIds
    .map((id) => wordsById.get(id))
    .filter((entry): entry is WordEntry => entry !== undefined)
    .filter((entry) => !normalized
      || entry.word.toLowerCase().includes(normalized)
      || entry.meaning.toLowerCase().includes(normalized))
}
