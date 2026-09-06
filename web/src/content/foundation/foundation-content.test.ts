import { describe, expect, it } from 'vitest'
import { adjectivesAndAdverbs } from './adjectives-and-adverbs'
import { basicTenses } from './basic-tenses'
import { nounsAndPronouns } from './nouns-and-pronouns'

describe('基础语法内容审校', () => {
  it('keeps the fruit distractors in grammar-019 incompatible with the intended uncountable reading', () => {
    const question = nounsAndPronouns.find(({ id }) => id === 'grammar-019')

    expect(question?.options).toEqual(['some fruit', 'a fruit', 'many fruit', 'few fruit'])
  })

  it('uses past perfect continuous for the ongoing wait in grammar-057', () => {
    const question = basicTenses.find(({ id }) => id === 'grammar-057')

    expect(question?.answer).toBe('had been waiting')
  })

  it('explains less plus adjective as a degree comparison in grammar-105', () => {
    const question = adjectivesAndAdverbs.find(({ id }) => id === 'grammar-105')

    expect(question?.explanation).toBe('less + 形容词 + than 表示“较不……/没那么……”，用于比较程度。')
  })
})
