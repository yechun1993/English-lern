import { describe, expect, it } from 'vitest'
import { validatePassageAssignments } from '../../domain/passage'
import { readingPassages, readingQuestions } from './reading-bank'

describe('阅读理解练习内容', () => {
  it('keeps each article linked to four four-choice questions', () => {
    expect(readingPassages).toHaveLength(4)
    expect(readingQuestions).toHaveLength(16)
    expect(readingQuestions.every((question) => question.options.length === 4)).toBe(true)
    expect(validatePassageAssignments(readingQuestions, readingPassages).issues).toEqual([])

    const questionsByPassage = new Map<string, typeof readingQuestions>()
    for (const question of readingQuestions) {
      const questions = questionsByPassage.get(question.passageId ?? '') ?? []
      questions.push(question)
      questionsByPassage.set(question.passageId ?? '', questions)
    }

    expect(questionsByPassage.size).toBe(4)
    expect([...questionsByPassage.values()].every((questions) => questions.length === 4)).toBe(true)
  })
})
