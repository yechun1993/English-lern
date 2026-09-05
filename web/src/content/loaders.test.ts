import { describe, expect, it } from 'vitest'
import {
  loadClozePractice,
  loadDiagnosticPractice,
  loadGrammarTopics,
  loadReadingPractice,
  loadTranslationPractice,
  loadWritingPractice,
} from './loaders'

describe('题库按题型加载器', () => {
  it('按需返回诊断和语法专题题库', async () => {
    const [diagnostic, grammar] = await Promise.all([
      loadDiagnosticPractice(),
      loadGrammarTopics(),
    ])

    expect(diagnostic.success).toBe(true)
    expect(diagnostic.questions).toHaveLength(20)
    expect(grammar).toHaveLength(18)
    expect(grammar.flatMap((bank) => bank.questions)).toHaveLength(360)
  })

  it('按需返回篇章和主观题专项', async () => {
    const [cloze, reading, translation, writing] = await Promise.all([
      loadClozePractice(),
      loadReadingPractice(),
      loadTranslationPractice(),
      loadWritingPractice(),
    ])

    expect(cloze.questionBank.success).toBe(true)
    expect(cloze.passages).toHaveLength(12)
    expect(reading.questionBank.success).toBe(true)
    expect(reading.passages).toHaveLength(16)
    expect(translation.questionBank.success).toBe(true)
    expect(translation.topicBanks).toHaveLength(8)
    expect(writing.questionBank.success).toBe(true)
    expect(writing.questions).toHaveLength(16)
  })
})
