import { describe, expect, it } from 'vitest'
import { QuestionSchema, validateQuestionBank } from './question'

const singleChoiceQuestion = {
  id: 'grammar-001',
  type: 'single-choice',
  topic: '主谓一致',
  difficulty: 'foundation',
  stem: 'The number of students in the class ___ thirty.',
  options: ['is', 'are', 'be'],
  answer: 'is',
  explanation: 'The number of 后面用单数谓语。',
  misconception: '不要把 students 误当作句子主语。',
  version: 1,
}

describe('QuestionSchema', () => {
  it('accepts a well-formed objective question', () => {
    expect(QuestionSchema.safeParse(singleChoiceQuestion).success).toBe(true)
  })

  it('rejects an answer that is not among the options', () => {
    const result = QuestionSchema.safeParse({
      ...singleChoiceQuestion,
      answer: 'was',
    })

    expect(result.success).toBe(false)
  })

  it('requires passage metadata for a cloze item', () => {
    const result = QuestionSchema.safeParse({
      ...singleChoiceQuestion,
      id: 'cloze-001',
      type: 'cloze',
    })

    expect(result.success).toBe(false)
  })
})

describe('validateQuestionBank', () => {
  it('rejects duplicate IDs before content can be published', () => {
    const result = validateQuestionBank([singleChoiceQuestion, singleChoiceQuestion])

    expect(result.success).toBe(false)
    expect(result.issues).toContain('题目 ID 重复：grammar-001')
  })
})
