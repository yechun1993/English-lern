import type { Question } from '../../domain/question'

export type FoundationEntry = readonly [
  stem: string,
  options: readonly [string, string, string, string],
  answer: string,
  explanation: string,
  misconception: string,
]

export function createFoundationQuestions(
  topic: string,
  startNumber: number,
  entries: readonly FoundationEntry[],
): Question[] {
  return entries.map(([stem, options, answer, explanation, misconception], index) => ({
    id: `grammar-${String(startNumber + index).padStart(3, '0')}`,
    type: 'single-choice',
    topic,
    difficulty: 'foundation',
    stem,
    options: [...options],
    answer,
    explanation,
    misconception,
    version: 1,
  }))
}
