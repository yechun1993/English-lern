import { describe, expect, it } from 'vitest'
import { diagnosticQuestions, grammarAdvancedQuestions, grammarFoundationQuestions } from './manifest'

describe('基础题库覆盖', () => {
  it('provides a 20-question diagnostic across the core sample-paper skills', () => {
    expect(diagnosticQuestions.success).toBe(true)

    if (diagnosticQuestions.success) {
      const topics = new Set(diagnosticQuestions.questions.map((question) => question.topic))
      for (const topic of [
        '时态',
        '主谓一致',
        '介词搭配',
        '冠词',
        '反意疑问句',
        '非谓语',
        '从句',
        '虚拟语气',
        '倒装',
        '词义辨析',
      ]) {
        expect(topics).toContain(topic)
      }
    }
  })

  it('provides 180 four-choice foundation grammar questions across nine micro-topics', () => {
    expect(grammarFoundationQuestions.success).toBe(true)

    if (grammarFoundationQuestions.success) {
      expect(grammarFoundationQuestions.questions).toHaveLength(180)
      expect(new Set(grammarFoundationQuestions.questions.map((question) => question.topic)).size).toBe(9)
      expect(grammarFoundationQuestions.questions.every((question) => question.options.length > 0)).toBe(true)
      expect(grammarFoundationQuestions.questions.every((question) => question.options.length === 4)).toBe(true)
    }
  })

  it('provides 180 high-frequency grammar and collocation questions across nine error-prone topics', () => {
    expect(grammarAdvancedQuestions.success).toBe(true)

    if (grammarAdvancedQuestions.success) {
      expect(grammarAdvancedQuestions.questions).toHaveLength(180)
      expect(new Set(grammarAdvancedQuestions.questions.map((question) => question.topic)).size).toBe(9)
      expect(grammarAdvancedQuestions.questions.filter((question) => question.difficulty === 'foundation')).toHaveLength(72)
      expect(grammarAdvancedQuestions.questions.filter((question) => question.difficulty === 'standard')).toHaveLength(90)
      expect(grammarAdvancedQuestions.questions.filter((question) => question.difficulty === 'challenge')).toHaveLength(18)
      expect(grammarAdvancedQuestions.questions.every((question) => question.options.length === 4)).toBe(true)
    }
  })
})
