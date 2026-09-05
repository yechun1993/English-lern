import { describe, expect, it } from 'vitest'
import { writingQuestions } from './writing-bank'

function countEnglishWords(text: string): number {
  return (text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? []).length
}

describe('写作专项题库', () => {
  it('provides 16 general-topic writing prompts with three outline points', () => {
    expect(writingQuestions).toHaveLength(16)
    expect(writingQuestions.every((question) => question.type === 'writing')).toBe(true)
    expect(writingQuestions.every((question) => question.stem.split('\n').length === 4)).toBe(true)
  })

  it('gives every prompt a 120-to-150-word model essay and a usable self-checklist', () => {
    expect(writingQuestions.every((question) => {
      const wordCount = countEnglishWords(question.referenceAnswer ?? '')
      return wordCount >= 120 && wordCount <= 150
    })).toBe(true)
    expect(writingQuestions.every((question) => {
      const checklistLength = question.checklist?.length ?? 0
      return checklistLength >= 3 && checklistLength <= 5
    })).toBe(true)
  })

  it('keeps audited digital-life and volunteering expressions natural', () => {
    const internetEssay = writingQuestions.find((question) => question.topic === '网络使用与自律')
    const volunteeringEssay = writingQuestions.find((question) => question.topic === '志愿服务')

    expect(internetEssay?.referenceAnswer).toContain('turn off unnecessary notifications')
    expect(volunteeringEssay?.referenceAnswer).toContain('make a community a warmer place')
  })
})
