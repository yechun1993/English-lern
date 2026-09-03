import type { Question } from '../../domain/question'

export type AdvancedEntry = readonly [
  stem: string,
  options: readonly [string, string, string, string],
  answer: string,
  explanation: string,
  misconception: string,
]

function getDifficulty(index: number): Question['difficulty'] {
  if (index < 8) {
    return 'foundation'
  }

  if (index < 18) {
    return 'standard'
  }

  return 'challenge'
}

export function createAdvancedQuestions(
  topic: string,
  startNumber: number,
  entries: readonly AdvancedEntry[],
): Question[] {
  return entries.map(([stem, options, answer, explanation, misconception], index) => ({
    id: `grammar-${String(startNumber + index).padStart(3, '0')}`,
    type: 'single-choice',
    topic,
    difficulty: getDifficulty(index),
    stem,
    options: [...options],
    answer,
    explanation,
    misconception,
    version: 1,
  }))
}
