import { describe, expect, it } from 'vitest'
import { createAdvancedQuestions } from './advanced-utils'

describe('createAdvancedQuestions', () => {
  it('assigns sequential IDs and the planned difficulty progression', () => {
    const questions = createAdvancedQuestions('测试专题', 181, [
      ['Question 1', ['a', 'b', 'c', 'd'], 'a', '解析', '易错点'],
      ['Question 2', ['a', 'b', 'c', 'd'], 'b', '解析', '易错点'],
      ['Question 3', ['a', 'b', 'c', 'd'], 'c', '解析', '易错点'],
    ])

    expect(questions.map((question) => question.id)).toEqual([
      'grammar-181',
      'grammar-182',
      'grammar-183',
    ])
    expect(questions.map((question) => question.difficulty)).toEqual([
      'foundation',
      'foundation',
      'foundation',
    ])
  })

  it('uses eight foundation, ten standard and two challenge items for a full topic', () => {
    const entries = Array.from({ length: 20 }, (_, index) => [
      `Question ${index + 1}`,
      ['a', 'b', 'c', 'd'],
      'a',
      '解析',
      '易错点',
    ] as const)

    const questions = createAdvancedQuestions('测试专题', 181, entries)

    expect(questions.map((question) => question.difficulty)).toEqual([
      ...Array(8).fill('foundation'),
      ...Array(10).fill('standard'),
      ...Array(2).fill('challenge'),
    ])
  })
})
