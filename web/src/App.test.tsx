import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('shows the daily learning entry point', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '今日学习' })).toBeInTheDocument()
  })

  it('opens a diagnostic practice session from the dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '开始练习' }))

    expect(screen.getByText('诊断练习')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '第 1 / 20 题' })).toBeInTheDocument()
  })
})
