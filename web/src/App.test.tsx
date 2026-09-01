import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('shows the daily learning entry point', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '今日学习' })).toBeInTheDocument()
  })
})
