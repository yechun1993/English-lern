import { getWordCandidates } from './word-selection'
import type { WordEntry } from './word'

export type WordBatchRule =
  | { readonly kind: 'ordered' }
  | { readonly kind: 'random'; readonly seed: number }
  | { readonly kind: 'initial'; readonly initial: string }

export interface WordStudyBatch {
  readonly requestedSize: number
  readonly actualSize: number
  readonly rule: WordBatchRule
  readonly wordIds: readonly string[]
  readonly remainingWordIds: readonly string[]
}

interface CreateWordStudyBatchInput {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  requestedSize: number
  rule: WordBatchRule
}

const INVALID_BATCH_MESSAGE = '单词批次参数无效。'

interface CreateWordStudyBatchResult {
  readonly availableCount: number
  readonly batch: WordStudyBatch
}

export function createWordStudyBatch(input: CreateWordStudyBatchInput): CreateWordStudyBatchResult {
  if (!Number.isInteger(input.requestedSize) || input.requestedSize <= 0) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }
  if (input.rule.kind === 'initial' && !/^[A-Z]$/.test(input.rule.initial)) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }

  const rule: WordBatchRule = input.rule.kind === 'ordered'
    ? { kind: 'ordered' }
    : input.rule.kind === 'random'
      ? { kind: 'random', seed: input.rule.seed }
      : { kind: 'initial', initial: input.rule.initial }
  const mode = rule.kind === 'initial' ? 'initial' : rule.kind
  const candidates = getWordCandidates({
    words: input.words,
    masteredWordIds: input.masteredWordIds,
    mode,
    initial: rule.kind === 'initial' ? rule.initial : undefined,
    query: '',
    shuffleSeed: rule.kind === 'random' ? rule.seed : undefined,
  })
  const selected = candidates.slice(0, input.requestedSize)
  const wordIds = selected.map((entry) => entry.id)
  const remainingWordIds = [...wordIds]
  return {
    availableCount: candidates.length,
    batch: {
      requestedSize: input.requestedSize,
      actualSize: wordIds.length,
      rule,
      wordIds,
      remainingWordIds,
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
