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

  it('opens a 20-question grammar micro-topic from the topic hub', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '专项突破' }))
    await user.click(screen.getByRole('button', { name: '主谓一致与数量表达 · 20 题' }))

    expect(screen.getByText('主谓一致与数量表达')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '第 1 / 20 题' })).toBeInTheDocument()
  })
})
