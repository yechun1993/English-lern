import { describe, expect, it } from 'vitest'
import {
  createContentReport,
  serializeContentBank,
} from './content-report'
import type { Question } from '../domain/question'

const sampleQuestion: Question = {
  id: 'translation-001',
  type: 'translation',
  topic: '基础句序与主谓一致',
  difficulty: 'foundation',
  stem: '请将下列句子译成英语：我每天学习英语。',
  options: [],
  answer: 'I study English every day.',
  referenceAnswer: 'I study English every day.',
  checklist: ['主语是否完整？', '时态是否正确？', '时间状语位置是否自然？'],
  explanation: '一般现在时描述习惯。',
  misconception: '不要漏掉 every day。',
  version: 1,
}

describe('内容报告与备份', () => {
  it('counts the whole bank by type, topic, and difficulty', () => {
    const report = createContentReport([
      sampleQuestion,
      { ...sampleQuestion, id: 'writing-001', type: 'writing', topic: '学习习惯', difficulty: 'standard' },
    ])

    expect(report.total).toBe(2)
    expect(report.byType).toMatchObject({ translation: 1, writing: 1 })
    expect(report.byTopic).toMatchObject({ 基础句序与主谓一致: 1, 学习习惯: 1 })
    expect(report.byDifficulty).toMatchObject({ foundation: 1, standard: 1 })
  })

  it('serializes content without losing questions or undefined values', () => {
    const backup = serializeContentBank([sampleQuestion])

    expect(backup).not.toContain('undefined')
    expect(JSON.parse(backup)).toEqual([sampleQuestion])
  })
})
