import { describe, expect, it } from 'vitest'
import { translationTopicBanks, translationQuestions } from './translation-bank'

describe('汉译英专项题库', () => {
  it('provides 80 sentences across eight focused topics', () => {
    expect(translationTopicBanks).toHaveLength(8)
    expect(translationTopicBanks.every((bank) => bank.questions.length === 10)).toBe(true)
    expect(translationQuestions).toHaveLength(80)
  })

  it('gives every sentence a natural reference answer and a usable self-checklist', () => {
    expect(translationQuestions.every((question) => question.type === 'translation')).toBe(true)
    expect(translationQuestions.every((question) => question.referenceAnswer?.length)).toBe(true)
    expect(translationQuestions.every((question) => {
      const checklistLength = question.checklist?.length ?? 0
      return checklistLength >= 3 && checklistLength <= 5
    })).toBe(true)
  })
})
