import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Question } from '../domain/question'
import { SubjectiveSession } from './SubjectiveSession'

const translationQuestion: Question = {
  id: 'translation-001',
  type: 'translation',
  topic: '基础句序',
  difficulty: 'foundation',
  stem: '请将下列句子译成英语：我每天早上步行去上班。',
  options: [],
  answer: 'I walk to work every morning.',
  referenceAnswer: 'I walk to work every morning.',
  checklist: ['主语是否放在句首？', '谓语时态是否正确？', 'every morning 是否放在句末？'],
  explanation: '先确定主干，再补时间状语。',
  misconception: '不要遗漏 walk to work 的介词。',
  version: 1,
}

describe('SubjectiveSession', () => {
  it('saves the learner draft before showing a reference answer and checklist', async () => {
    const user = userEvent.setup()
    const onSaveDraft = vi.fn()

    render(
      <SubjectiveSession
        title="汉译英 · 基础句序"
        questions={[translationQuestion]}
        onComplete={vi.fn()}
        onSaveDraft={onSaveDraft}
      />,
    )

    const textarea = screen.getByRole('textbox', { name: '我的译文' })
    await user.type(textarea, 'I walk to work every morning.')

    expect(screen.queryByText('参考答案')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '保存草稿并查看参考答案' }))

    expect(onSaveDraft).toHaveBeenCalledWith(translationQuestion, 'I walk to work every morning.')
    expect(screen.getByText('参考答案')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: '参考答案与自检' })).toHaveTextContent(
      'I walk to work every morning.',
    )
    expect(screen.getByText('主语是否放在句首？')).toBeInTheDocument()
  })
})
