import { describe, expect, it } from 'vitest'
import type { Question } from './question'
import { PassageSchema, validateClozeAssignments, validatePassageAssignments } from './passage'

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

const readingPassage = {
  id: 'reading-passage-01',
  type: 'reading',
  title: '城市图书馆',
  body: Array.from({ length: 220 }, () => 'word').join(' '),
}

const readingQuestion: Question = {
  id: 'reading-001',
  type: 'reading',
  topic: '细节定位',
  difficulty: 'foundation',
  stem: 'What is the passage mainly about?',
  options: ['A library', 'A school', 'A market', 'A hospital'],
  answer: 'A library',
  explanation: '题目用于验证阅读题和文章的关联。',
  misconception: '不要把阅读题关联到完形文章。',
  version: 1,
  passageId: 'reading-passage-01',
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

  it('requires reading passages to meet the same word range without blank markers', () => {
    expect(PassageSchema.safeParse(readingPassage).success).toBe(true)
    expect(PassageSchema.safeParse({ ...readingPassage, body: 'too short' }).success).toBe(false)
  })
})

describe('validateClozeAssignments', () => {
  it('requires every cloze item to point to an existing numbered blank', () => {
    expect(validateClozeAssignments([clozeQuestion], [clozePassage]).issues).toEqual([])
    expect(validateClozeAssignments([
      clozeQuestion,
    ], [clozePassage, { ...readingPassage, body: 'too short' }]).issues).toEqual([])
    expect(validateClozeAssignments([
      { ...clozeQuestion, blankIndex: 2 },
    ], [clozePassage]).issues).toContain('完形题 cloze-001 引用的第 2 空不存在。')
  })
})

describe('validatePassageAssignments', () => {
  it('requires each reading item to point to an existing reading passage', () => {
    expect(validatePassageAssignments([readingQuestion], [readingPassage]).issues).toEqual([])
    expect(validatePassageAssignments([
      { ...readingQuestion, passageId: 'cloze-passage-01' },
    ], [clozePassage, readingPassage]).issues).toContain('阅读题 reading-001 引用的文章类型不匹配。')
  })
})
