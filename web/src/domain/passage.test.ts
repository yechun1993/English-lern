import { describe, expect, it } from 'vitest'
import type { Question } from './question'
import { PassageSchema, validateClozeAssignments } from './passage'

const withinWordLimitBody = `${Array.from({ length: 220 }, () => 'word').join(' ')} [1]`

const clozePassage = {
  id: 'cloze-passage-01',
  type: 'cloze',
  title: '家庭沟通',
  body: withinWordLimitBody,
}

const clozeQuestion: Question = {
  id: 'cloze-001',
  type: 'cloze',
  topic: '固定搭配',
  difficulty: 'foundation',
  stem: '请选择文中最合适的词。',
  options: ['each', 'every', 'all', 'both'],
  answer: 'each',
  explanation: 'each other 表示彼此。',
  misconception: 'every other 表示每隔一个。',
  version: 1,
  passageId: 'cloze-passage-01',
  blankIndex: 1,
}

describe('PassageSchema', () => {
  it('accepts a cloze passage with numbered blank markers', () => {
    expect(PassageSchema.safeParse(clozePassage).success).toBe(true)
  })

  it('rejects a cloze passage without a blank marker', () => {
    expect(PassageSchema.safeParse({ ...clozePassage, body: withinWordLimitBody.replace(' [1]', '') }).success).toBe(false)
  })

  it('rejects a cloze passage outside the official 220 to 300 word range', () => {
    const tooLongBody = `${Array.from({ length: 301 }, () => 'word').join(' ')} [1]`

    expect(PassageSchema.safeParse({ ...clozePassage, body: tooLongBody }).success).toBe(false)
  })
})

describe('validateClozeAssignments', () => {
  it('requires every cloze item to point to an existing numbered blank', () => {
    expect(validateClozeAssignments([clozeQuestion], [clozePassage]).issues).toEqual([])
    expect(validateClozeAssignments([
      { ...clozeQuestion, blankIndex: 2 },
    ], [clozePassage]).issues).toContain('完形题 cloze-001 引用的第 2 空不存在。')
  })
})
