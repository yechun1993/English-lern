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

  it('uses a natural actor for the before-clause in translation-026', () => {
    const question = translationQuestions.find(({ id }) => id === 'translation-026')

    expect(question?.referenceAnswer).toBe('All the lights were turned off before everyone left the classroom.')
  })

  it('keeps the misconception note for translation-063 focused on the target collocation', () => {
    const question = translationQuestions.find(({ id }) => id === 'translation-063')

    expect(question?.misconception).toBe('不要遗漏 keep in touch 中的 in；after 后接名词或动名词。')
  })
})
