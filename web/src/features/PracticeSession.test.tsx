import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../domain/question'
import { PracticeSession } from './PracticeSession'

const question: Question = {
  id: 'grammar-001',
  type: 'single-choice',
  topic: '主谓一致',
  difficulty: 'foundation',
  stem: 'The number of students in the class ___ thirty.',
  options: ['is', 'are', 'be'],
  answer: 'is',
  explanation: 'The number of 后面用单数谓语。',
  misconception: '不要被 students 影响。',
  version: 1,
}

const readingQuestion: Question = {
  ...question,
  id: 'reading-001',
  type: 'reading',
  passageId: 'reading-passage-01',
}

describe('PracticeSession', () => {
  it('waits for the learner to check the answer before showing feedback', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<PracticeSession title="诊断练习" questions={[question]} onBack={vi.fn()} onComplete={onComplete} />)

    await user.click(screen.getByRole('button', { name: 'is' }))

    expect(screen.queryByText('回答正确')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '核对答案' }))

    expect(screen.getByText('回答正确')).toBeInTheDocument()
    expect(screen.getByText('The number of 后面用单数谓语。')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '完成本组练习' }))

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('keeps a guessed correct answer in the review flow', async () => {
    const user = userEvent.setup()
    const onAnswer = vi.fn()
    render(
      <PracticeSession title="诊断练习" questions={[question]} onAnswer={onAnswer} onBack={vi.fn()} onComplete={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'is' }))
    await user.click(screen.getByRole('checkbox', { name: '这题是猜的' }))
    await user.click(screen.getByRole('button', { name: '核对答案' }))

    expect(screen.getByText('答案正确，但已记为需复习')).toBeInTheDocument()
    expect(onAnswer).toHaveBeenCalledWith(question, 'is', true, true)
  })

  it('shows the full reading article while the learner answers a reading question', () => {
    render(
      <PracticeSession
        title="阅读理解 · 图书馆"
        questions={[readingQuestion]}
        passages={[
          {
            id: 'reading-passage-01',
            type: 'reading',
            title: '图书馆',
            body: 'A short reading passage for the learner.',
          },
        ]}
        onBack={vi.fn()}
        onComplete={vi.fn()}
      />,
    )

    expect(screen.getByRole('region', { name: '阅读文章' })).toHaveTextContent('A short reading passage')
  })

  it('lets the learner leave an unfinished objective practice set', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<PracticeSession title="诊断练习" questions={[question]} onBack={onBack} onComplete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '返回专项' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
