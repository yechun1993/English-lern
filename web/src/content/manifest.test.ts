import { describe, expect, it } from 'vitest'
import { diagnosticQuestions } from './manifest'

describe('diagnosticQuestions', () => {
  it('contains only schema-valid questions with unique IDs', () => {
    expect(diagnosticQuestions.success).toBe(true)

    if (diagnosticQuestions.success) {
      expect(diagnosticQuestions.questions).toHaveLength(20)
      expect(new Set(diagnosticQuestions.questions.map((question) => question.id)).size).toBe(
        diagnosticQuestions.questions.length,
      )
    }
  })
})
