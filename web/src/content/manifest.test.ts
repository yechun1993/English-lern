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

  it('includes every cloze passage only when it has 20 valid numbered blanks', () => {
    expect(clozeQuestionBank.success).toBe(true)
    expect(clozeAssignmentIssues).toEqual([])

    if (clozeQuestionBank.success) {
      expect(clozeQuestionBank.questions).toHaveLength(140)
      const questionsByPassage = new Map<string, typeof clozeQuestionBank.questions>()
      for (const question of clozeQuestionBank.questions) {
        if (!question.passageId) {
          continue
        }

        const questions = questionsByPassage.get(question.passageId) ?? []
        questions.push(question)
        questionsByPassage.set(question.passageId, questions)
      }

      expect(questionsByPassage.size).toBe(7)
      for (const questions of questionsByPassage.values()) {
        expect(questions).toHaveLength(20)
        expect(new Set(questions.map((question) => question.blankIndex)).size).toBe(20)
      }
    }
  })
})
