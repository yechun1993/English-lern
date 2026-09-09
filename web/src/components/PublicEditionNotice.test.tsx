import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PublicEditionNotice } from './PublicEditionNotice'

describe('PublicEditionNotice', () => {
  it('shows a neutral public-use notice without authorization semantics', () => {
    render(<PublicEditionNotice />)

    const notice = screen.getByLabelText('公开版提示')
    expect(notice).toHaveTextContent('公开学习版 · 免费使用')
    expect(notice).not.toHaveTextContent('授权')
    expect(notice).not.toHaveTextContent('卖家')
  })
})
