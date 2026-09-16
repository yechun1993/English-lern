import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WordMasteryBurst } from './WordMasteryBurst'

describe('WordMasteryBurst', () => {
  it('renders an aria-hidden ten-particle burst for its word', () => {
    render(<WordMasteryBurst wordId="word-0001" />)

    const burst = screen.getByTestId('mastery-burst-word-0001')
    expect(burst).toHaveAttribute('aria-hidden', 'true')
    expect(burst.querySelectorAll('.word-mastery-particle')).toHaveLength(10)
  })
})
