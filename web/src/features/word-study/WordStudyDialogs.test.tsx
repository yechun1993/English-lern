import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  WordBatchChangeDialog,
  WordBatchCompleteDialog,
  WordGoalDialog,
} from './WordStudyDialogs'

describe('WordGoalDialog', () => {
  it('starts with a gray real value 30 and turns black after editing', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(
      <WordGoalDialog
        availableCount={100}
        canCancel={false}
        onBack={vi.fn()}
        onCancel={vi.fn()}
        onStart={onStart}
        onViewMastered={vi.fn()}
      />,
    )

    const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
    expect(input).toHaveValue(30)
    expect(input).toHaveClass('is-default-value')
    await user.clear(input)
    await user.type(input, '12')
    expect(input).toHaveClass('is-edited-value')
    await user.click(screen.getByRole('button', { name: '开背' }))
    expect(onStart).toHaveBeenCalledWith(12)
  })

  it('keeps the goal dialog open for invalid or excessive values', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(
      <WordGoalDialog
        availableCount={8}
        canCancel={false}
        onBack={vi.fn()}
        onCancel={vi.fn()}
        onStart={onStart}
        onViewMastered={vi.fn()}
      />,
    )

    const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
    await user.clear(input)
    await user.type(input, '30')
    await user.click(screen.getByRole('button', { name: '开背' }))
    expect(screen.getByRole('alert')).toHaveTextContent('当前最多可背8个单词')
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(onStart).not.toHaveBeenCalled()
  })

  it('rejects zero without closing the dialog', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    render(
      <WordGoalDialog
        availableCount={8}
        canCancel={false}
        onBack={vi.fn()}
        onCancel={vi.fn()}
        onStart={onStart}
        onViewMastered={vi.fn()}
      />,
    )

    const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
    await user.clear(input)
    await user.type(input, '0')
    await user.keyboard('{Enter}')

    expect(screen.getByRole('alert')).toBeVisible()
    expect(screen.getByRole('dialog')).toBeVisible()
    expect(onStart).not.toHaveBeenCalled()
  })

  it('shows mastered and back choices when no candidate remains', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    const onViewMastered = vi.fn()
    render(
      <WordGoalDialog
        availableCount={0}
        canCancel={false}
        onBack={onBack}
        onCancel={vi.fn()}
        onStart={vi.fn()}
        onViewMastered={onViewMastered}
      />,
    )

    expect(screen.getByText('全部单词已掌握')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '查看已掌握单词' }))
    await user.click(screen.getByRole('button', { name: '返回今日学习' }))
    expect(onViewMastered).toHaveBeenCalledOnce()
    expect(onBack).toHaveBeenCalledOnce()
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  })

  it('renders cancel only when permitted and handles Escape only then', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const { rerender } = render(
      <WordGoalDialog
        availableCount={100}
        canCancel={false}
        onBack={vi.fn()}
        onCancel={onCancel}
        onStart={vi.fn()}
        onViewMastered={vi.fn()}
      />,
    )

    expect(screen.queryByRole('button', { name: '取消' })).not.toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onCancel).not.toHaveBeenCalled()

    rerender(
      <WordGoalDialog
        availableCount={100}
        canCancel
        onBack={vi.fn()}
        onCancel={onCancel}
        onStart={vi.fn()}
        onViewMastered={vi.fn()}
      />,
    )
    await user.click(screen.getByRole('button', { name: '取消' }))
    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(2)
  })
})

describe('WordBatchChangeDialog', () => {
  it('confirms or cancels a pending random batch', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <WordBatchChangeDialog
        availableCount={1911}
        description="将会重新按照随机单词排序给出30个单词背诵"
        onCancel={onCancel}
        onConfirm={onConfirm}
        requestedSize={30}
      />,
    )

    expect(screen.getByRole('dialog', { name: '重新生成本轮单词？' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(onCancel).toHaveBeenCalledOnce()
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('adds the current maximum when fewer candidates are available', () => {
    render(
      <WordBatchChangeDialog
        availableCount={0}
        description="将会重新按照随机单词排序给出30个单词背诵"
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        requestedSize={30}
      />,
    )

    expect(screen.getByText('当前最多可提供0个。')).toBeVisible()
  })

  it('can be cancelled with Escape', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(
      <WordBatchChangeDialog
        availableCount={30}
        description="重新生成单词"
        onCancel={onCancel}
        onConfirm={vi.fn()}
        requestedSize={30}
      />,
    )

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledOnce()
  })
})

describe('WordBatchCompleteDialog', () => {
  it('shows the fixed completion copy and both decisions', () => {
    render(<WordBatchCompleteDialog onContinue={vi.fn()} onRest={vi.fn()} />)

    expect(screen.getByText('建议劳逸结合，不要急功近利哦～')).toBeVisible()
    expect(screen.getByRole('button', { name: '先休息一下' })).toBeVisible()
    expect(screen.getByRole('button', { name: '继续背' })).toBeVisible()
  })

  it('delegates both completion decisions', async () => {
    const user = userEvent.setup()
    const onContinue = vi.fn()
    const onRest = vi.fn()
    render(<WordBatchCompleteDialog onContinue={onContinue} onRest={onRest} />)

    await user.click(screen.getByRole('button', { name: '先休息一下' }))
    await user.click(screen.getByRole('button', { name: '继续背' }))
    expect(onRest).toHaveBeenCalledOnce()
    expect(onContinue).toHaveBeenCalledOnce()
  })
})
