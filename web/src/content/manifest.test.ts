import { describe, expect, it } from 'vitest'
import {
  clozeAssignmentIssues,
  clozeQuestionBank,
  diagnosticQuestions,
  readingAssignmentIssues,
  readingQuestionBank,
  allQuestions,
} from './manifest'

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
      expect(clozeQuestionBank.questions).toHaveLength(240)
      const questionsByPassage = new Map<string, typeof clozeQuestionBank.questions>()
      for (const question of clozeQuestionBank.questions) {
        if (!question.passageId) {
          continue
        }

        const questions = questionsByPassage.get(question.passageId) ?? []
        questions.push(question)
        questionsByPassage.set(question.passageId, questions)
      }

      expect(questionsByPassage.size).toBe(12)
      for (const questions of questionsByPassage.values()) {
        expect(questions).toHaveLength(20)
        expect(new Set(questions.map((question) => question.blankIndex)).size).toBe(20)
      }
    }
  })

  it('includes every reading passage only when it has four valid questions', () => {
    expect(readingQuestionBank.success).toBe(true)
    expect(readingAssignmentIssues).toEqual([])

    if (readingQuestionBank.success) {
      expect(readingQuestionBank.questions).toHaveLength(64)
      const questionsByPassage = new Map<string, typeof readingQuestionBank.questions>()
      for (const question of readingQuestionBank.questions) {
        const questions = questionsByPassage.get(question.passageId ?? '') ?? []
        questions.push(question)
        questionsByPassage.set(question.passageId ?? '', questions)
      }

      expect(questionsByPassage.size).toBe(16)
      expect([...questionsByPassage.values()].every((questions) => questions.length === 4)).toBe(true)
    }
  })

  it('includes all 80 translation sentences in the validated content collection', () => {
    expect(allQuestions.success).toBe(true)

    if (allQuestions.success) {
      const translations = allQuestions.questions.filter((question) => question.type === 'translation')
      expect(translations).toHaveLength(80)
      expect(new Set(translations.map((question) => question.topic))).toHaveLength(8)
    }
  })
})
