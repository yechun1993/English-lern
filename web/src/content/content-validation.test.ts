import { describe, expect, it } from 'vitest'
import { collectContentIssues } from './content-validation'

describe('collectContentIssues', () => {
  it('combines question-bank and passage-assignment errors for the release gate', () => {
    expect(collectContentIssues(['题目 ID 重复：cloze-001'], ['完形题 cloze-001 引用的第 1 空不存在。'])).toEqual([
      '题目 ID 重复：cloze-001',
      '完形题 cloze-001 引用的第 1 空不存在。',
    ])
  })
})
