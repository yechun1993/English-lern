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

    expect(await screen.findByText('诊断练习')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '第 1 / 20 题' })).toBeInTheDocument()
  })

  it('lets the learner choose one cloze passage before starting practice', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '选择篇章' }))

    await user.click(await screen.findByRole('button', { name: '校园学习：学会安排自己的时间 · 20 空' }))

    expect(await screen.findByText('完形填空 · 校园学习：学会安排自己的时间')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '第 1 / 20 题' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '完形文章' })).toHaveTextContent('When Lin began university')
    expect(screen.getByRole('region', { name: '完形文章' })).toHaveTextContent('[1]')
  })

  it('lets the learner choose one reading article before starting practice', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '选择阅读' }))

    await user.click(await screen.findByRole('button', { name: '社区图书馆：从借书处到共享空间 · 4 题' }))

    expect(await screen.findByText('阅读理解 · 社区图书馆：从借书处到共享空间')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '第 1 / 4 题' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '阅读文章' })).toHaveTextContent('East Street Library')
  })

  it('lets the learner choose a translation topic, save a draft, and then view the reference', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '选择专题' }))

    await user.click(await screen.findByRole('button', { name: '基础句序与主谓一致 · 10 句' }))
    expect(await screen.findByText('汉译英 · 基础句序与主谓一致')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: '我的译文' }), 'I get up at seven every morning.')
    await user.click(screen.getByRole('button', { name: '保存草稿并查看参考答案' }))

    expect(screen.getByRole('region', { name: '参考答案与自检' })).toHaveTextContent(
      'I get up at seven every morning.',
    )
    expect(JSON.parse(window.localStorage.getItem('szu-degree-english.study-state.v1') ?? '{}')).toMatchObject({
      drafts: {
        'translation-001': {
          content: 'I get up at seven every morning.',
        },
      },
    })
  })

  it('lets the learner choose one writing prompt and draft before reading the model essay', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '选择题目' }))

    await user.click(await screen.findByRole('button', { name: '网络使用与自律 · 1 题' }))
    expect(await screen.findByText('写作 · 网络使用与自律')).toBeInTheDocument()

    await user.type(screen.getByRole('textbox', { name: '我的作文' }), 'The Internet is useful.')
    await user.click(screen.getByRole('button', { name: '保存草稿并查看参考答案' }))

    expect(screen.getByRole('region', { name: '参考答案与自检' })).toHaveTextContent(
      'The Internet has become an important part of daily life.',
    )
    expect(JSON.parse(window.localStorage.getItem('szu-degree-english.study-state.v1') ?? '{}')).toMatchObject({
      drafts: {
        'writing-001': {
          content: 'The Internet is useful.',
        },
      },
    })
  })

  it('opens a 20-question grammar micro-topic from the topic hub', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '专项突破' }))
    await user.click(await screen.findByRole('button', { name: '主谓一致与数量表达 · 20 题' }))

    expect(await screen.findByText('主谓一致与数量表达')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '第 1 / 20 题' })).toBeInTheDocument()
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

    expect(await screen.findByText('到期复习')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: '第 1 / 1 题' })).toBeInTheDocument()
  })
})
