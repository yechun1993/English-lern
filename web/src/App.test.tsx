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

  it('shows the learner\'s real local practice and review counts', () => {
    window.localStorage.setItem(
      'szu-degree-english.study-state.v1',
      JSON.stringify({
        attempts: [
          {
            id: 'attempt-1',
            questionId: 'grammar-001',
            answer: 'book',
            correct: true,
            guessed: false,
            createdAt: '2026-09-01T08:00:00.000Z',
          },
        ],
        drafts: {},
        masteryByQuestion: {
          'grammar-001': {
            status: 'learning',
            correctStreak: 1,
            correctReviewDays: ['2026-09-01'],
            intervalDays: 1,
            nextReviewAt: '2026-09-02T08:00:00.000Z',
            lastAttemptAt: '2026-09-01T08:00:00.000Z',
          },
        },
        pending: [],
      }),
    )

    render(<App />)

    expect(screen.getByText((_, element) => element?.textContent === '已完成 1 题')).toBeInTheDocument()
    expect(screen.getByText('有 1 题到期复习')).toBeInTheDocument()
  })

  it('opens due questions as a review session', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(
      'szu-degree-english.study-state.v1',
      JSON.stringify({
        attempts: [],
        drafts: {},
        masteryByQuestion: {
          'grammar-001': {
            status: 'learning',
            correctStreak: 1,
            correctReviewDays: ['2026-09-01'],
            intervalDays: 1,
            nextReviewAt: '2026-09-02T08:00:00.000Z',
            lastAttemptAt: '2026-09-01T08:00:00.000Z',
          },
        },
        pending: [],
      }),
    )
    render(<App />)

    await user.click(screen.getByRole('button', { name: '去复习' }))

    expect(screen.getByText('到期复习')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '第 1 / 1 题' })).toBeInTheDocument()
  })
})
