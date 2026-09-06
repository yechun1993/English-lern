import { describe, expect, it } from 'vitest'
import { prepositionCollocations } from './preposition-collocations'

describe('高频介词与形容词搭配题库', () => {
  it('keeps the be interested in misconception note aligned with its actual options', () => {
    const question = prepositionCollocations.find(({ id }) => id === 'grammar-301')

    expect(question?.misconception).toBe('不要把 be interested in 与 be good at 混淆。')
  })
})
