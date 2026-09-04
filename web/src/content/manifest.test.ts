import { describe, expect, it } from 'vitest'
import { clozeAssignmentIssues, clozeQuestionBank, diagnosticQuestions } from './manifest'

describe('题库清单', () => {
  it('contains only schema-valid questions with unique IDs', () => {
    expect(diagnosticQuestions.success).toBe(true)

    if (diagnosticQuestions.success) {
      expect(diagnosticQuestions.questions).toHaveLength(20)
      expect(new Set(diagnosticQuestions.questions.map((question) => question.id)).size).toBe(
        diagnosticQuestions.questions.length,
      )
    }
  })

  it('includes the cloze pilot only when all numbered blanks are valid', () => {
    expect(clozeQuestionBank.success).toBe(true)
    expect(clozeAssignmentIssues).toEqual([])

    if (clozeQuestionBank.success) {
      expect(clozeQuestionBank.questions).toHaveLength(20)
      expect(new Set(clozeQuestionBank.questions.map((question) => question.blankIndex)).size).toBe(20)
    }
  })
})
