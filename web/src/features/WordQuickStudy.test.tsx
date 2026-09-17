import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WordEntry } from '../domain/word'
import { shuffleWords } from '../domain/word-selection'
import { WordQuickStudy, type WordQuickStudyProps } from './WordQuickStudy'

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: '/ˈeɪbl/', meaning: '能干的', note: null },
  { id: 'word-0003', index: 3, word: 'book', phonetic: '/bʊk/', meaning: '书', note: null },
  { id: 'word-0004', index: 4, word: 'zero', phonetic: '/ˈzɪroʊ/', meaning: '零', note: null },
]

function createProps(overrides: Partial<WordQuickStudyProps> = {}): WordQuickStudyProps {
  return {
    words,
    masteredWordIds: [],
    onBack: vi.fn(),
    onMarkMastered: vi.fn(),
    onUnmarkMastered: vi.fn(),
    ...overrides,
  }
}

function ImmediateMasteryParent({
  onMarkMastered,
  onUnmarkMastered = vi.fn(),
}: {
  onMarkMastered: (wordId: string) => void
  onUnmarkMastered?: (wordId: string) => void
}) {
  const [masteredWordIds, setMasteredWordIds] = useState<string[]>([])
  return (
    <WordQuickStudy
      {...createProps({
        masteredWordIds,
        onMarkMastered: (wordId) => {
          onMarkMastered(wordId)
          setMasteredWordIds((current) => [...current, wordId])
        },
        onUnmarkMastered,
      })}
    />
  )
}

describe('WordQuickStudy', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
    vi.spyOn(Date, 'now').mockReturnValue(23)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  async function enterGoal(goal: number) {
    const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
    await user.clear(input)
    await user.type(input, String(goal))
    await user.click(screen.getByRole('button', { name: '开背' }))
  }

  async function startWithGoal(goal: number, overrides: Partial<WordQuickStudyProps> = {}) {
    const props = createProps(overrides)
    const view = render(<WordQuickStudy {...props} />)
    await enterGoal(goal)
    return { props, ...view }
  }

  function visibleWordIds() {
    return within(screen.getByRole('list', { name: '单词列表' }))
      .getAllByRole('listitem').map((row) => row.getAttribute('data-word-id'))
  }

  it('hides the list until the learner accepts the default goal and starts ordered', async () => {
    const enoughWords = Array.from({ length: 35 }, (_, i) => ({
      ...words[0], id: `entry-${i}`, index: i + 1, word: `entry${i}`,
    }))
    render(<WordQuickStudy {...createProps({ words: enoughWords })} />)
    expect(screen.getByRole('dialog', { name: '设置本次背诵目标' })).toBeVisible()
    expect(screen.getByRole('spinbutton')).toHaveValue(30)
    expect(screen.queryByRole('list', { name: '单词列表' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '开背' }))
    expect(visibleWordIds()).toEqual(enoughWords.slice(0, 30).map((entry) => entry.id))
    expect(screen.getByRole('button', { name: '顺序单词' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps the fixed back button functional before starting', async () => {
    const props = createProps()
    render(<WordQuickStudy {...props} />)
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '返回今日学习' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })

  it('traps keyboard focus in the initial goal dialog and exposes a back action inside it', async () => {
    const props = createProps()
    render(<WordQuickStudy {...props} />)
    const dialog = screen.getByRole('dialog', { name: '设置本次背诵目标' })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    expect(within(dialog).getByRole('button', { name: '返回今日学习' })).toBeVisible()
    for (let index = 0; index < 5; index += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
    await user.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.click(within(dialog).getByRole('button', { name: '返回今日学习' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })

  it('traps focus in a rule confirmation and restores focus to its trigger on cancel', async () => {
    await startWithGoal(2)
    const trigger = screen.getByRole('button', { name: '随机单词' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: '重新生成本轮单词？' })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('restores the reset trigger after cancellation and keeps every Tab inside the goal dialog', async () => {
    await startWithGoal(2)
    const trigger = screen.getByRole('button', { name: '重新设定目标' })
    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: '设置本次背诵目标' })
    expect(within(dialog).getByRole('spinbutton')).toHaveFocus()
    for (let index = 0; index < 6; index += 1) {
      await user.tab({ shift: index % 2 === 0 })
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
    await user.click(within(dialog).getByRole('button', { name: '取消' }))
    expect(trigger).toHaveFocus()
  })

  it('traps focus in the completion dialog after a batch ends', async () => {
    await startWithGoal(1)
    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      await act(async () => { vi.advanceTimersByTime(800) })
    } finally {
      vi.useRealTimers()
    }
    const dialog = screen.getByRole('dialog', { name: '本轮背诵完成' })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
    await user.tab({ shift: true })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('persists mastery immediately and removes the row after the 800ms burst', async () => {
    const onMarkMastered = vi.fn()
    render(<ImmediateMasteryParent onMarkMastered={onMarkMastered} />)
    await enterGoal(2)

    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))

      expect(onMarkMastered).toHaveBeenCalledWith('word-0001')
      expect(screen.getByTestId('mastery-burst-word-0001')).toBeVisible()
      expect(screen.getByText('ability', { exact: true })).toBeVisible()
      await act(async () => { vi.advanceTimersByTime(800) })
      expect(screen.queryByText('ability', { exact: true })).not.toBeInTheDocument()
      expect(visibleWordIds()).toEqual(['word-0002'])
      expect(screen.queryByText('book', { exact: true })).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps the other word playing and cached through mastery, then disposes on a new batch', async () => {
    const fetchAudio = vi.fn(async () => new Response(new Blob(['mp3'], { type: 'audio/mpeg' })))
    vi.stubGlobal('fetch', fetchAudio)
    const createObjectURL = vi.fn(() => `blob:test-${createObjectURL.mock.calls.length}`)
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', Object.assign(class extends URL {}, { createObjectURL, revokeObjectURL }))
    render(<ImmediateMasteryParent onMarkMastered={vi.fn()} />)
    await enterGoal(2)
    await waitFor(() => expect(createObjectURL).toHaveBeenCalledTimes(2))
    const pausedBeforePlay = vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length
    await user.click(screen.getByRole('button', { name: '播放 able 的美式发音' }))
    const audio = screen.getByTestId('word-audio')
    expect(audio).toHaveAttribute('src', 'blob:test-2')
    expect(vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length).toBe(pausedBeforePlay + 1)

    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      await act(async () => { vi.advanceTimersByTime(800) })
    } finally {
      vi.useRealTimers()
    }
    expect(audio).toHaveAttribute('src', 'blob:test-2')
    expect(revokeObjectURL).not.toHaveBeenCalled()
    expect(fetchAudio).toHaveBeenCalledTimes(2)
    expect(vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length).toBe(pausedBeforePlay + 1)

    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    await enterGoal(1)
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledTimes(2))
    expect(vi.mocked(HTMLMediaElement.prototype.pause).mock.calls.length).toBeGreaterThan(pausedBeforePlay + 1)
  })

  it('disables undo while the immediate-parent mastery burst is active', async () => {
    const onMarkMastered = vi.fn()
    const onUnmarkMastered = vi.fn()
    render(<ImmediateMasteryParent onMarkMastered={onMarkMastered} onUnmarkMastered={onUnmarkMastered} />)
    await enterGoal(2)

    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      const undoButton = screen.getByRole('button', { name: '取消掌握 ability' })
      expect(undoButton).toBeDisabled()
      fireEvent.click(undoButton)
      expect(onUnmarkMastered).not.toHaveBeenCalled()

      await act(async () => { vi.advanceTimersByTime(800) })
      expect(onMarkMastered).toHaveBeenCalledWith('word-0001')
      expect(screen.queryByText('ability', { exact: true })).not.toBeInTheDocument()
      expect(screen.getByText('本轮目标 2 · 剩余 1')).toBeVisible()
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows a separate definition-state hint while keeping the word body and audio controls independent', async () => {
    await startWithGoal(2)
    expect(screen.getByTestId('word-audio')).not.toHaveAttribute('src')
    expect(screen.getByRole('button', { name: '点击可隐藏 ability 的中文释义' }))
      .toHaveTextContent('点击可隐藏中文释义')
    await user.click(screen.getByRole('button', { name: '点击可隐藏 ability 的中文释义' }))
    expect(screen.getByRole('button', { name: '点击可展示 ability 的中文释义' }))
      .toHaveTextContent('点击可展示中文释义')
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    expect(screen.getByText('能力')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '播放 ability 的美式发音' }))
    expect(screen.getByRole('button', { name: '正在加载 ability 的美式发音' })).toHaveTextContent('加载中…')
    expect(screen.getByTestId('word-audio')).toHaveAttribute('src', '/audio/words/0001.mp3')
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()
    expect(screen.getByText('能力')).toBeVisible()
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
  })

  it('removes immediately without a burst when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const { props } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
    expect(props.onMarkMastered).toHaveBeenCalledWith('word-0001')
    expect(screen.queryByTestId('mastery-burst-word-0001')).not.toBeInTheDocument()
    expect(screen.queryByText('ability', { exact: true })).not.toBeInTheDocument()
  })

  it('clears an active burst before rebuilding the batch', async () => {
    await startWithGoal(2)
    vi.useFakeTimers()
    try {
      const clearTimer = vi.spyOn(window, 'clearTimeout')
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      expect(screen.getByTestId('mastery-burst-word-0001')).toBeVisible()

      fireEvent.click(screen.getByRole('button', { name: '重新设定目标' }))
      fireEvent.change(screen.getByRole('spinbutton', { name: '本次背诵数量目标' }), { target: { value: '1' } })
      fireEvent.click(screen.getByRole('button', { name: '开背' }))

      expect(clearTimer).toHaveBeenCalled()
      expect(screen.queryByTestId('mastery-burst-word-0001')).not.toBeInTheDocument()
      await act(async () => { vi.advanceTimersByTime(800) })
      expect(screen.getByText('ability', { exact: true })).toBeVisible()
    } finally {
      vi.useRealTimers()
    }
  })

  it('announces an audio playback failure after showing the loading state', async () => {
    await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '播放 ability 的美式发音' }))
    expect(screen.getByText('加载中…')).toBeVisible()
    fireEvent.error(screen.getByTestId('word-audio'))
    expect(screen.getByText('播放失败，请再次点击')).toHaveAttribute('aria-live', 'polite')
  })

  it('removes externally mastered batch members without replenishing or restoring them after undo', async () => {
    const { props, rerender } = await startWithGoal(2)
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001']} />)
    expect(visibleWordIds()).toEqual(['word-0002'])
    expect(screen.getByText('本轮目标 2 · 剩余 1')).toBeVisible()
    expect(screen.queryByText('book', { exact: true })).not.toBeInTheDocument()
    expect(props.onMarkMastered).not.toHaveBeenCalled()

    rerender(<WordQuickStudy {...props} masteredWordIds={[]} />)
    expect(visibleWordIds()).toEqual(['word-0002'])
    expect(screen.getByText('本轮目标 2 · 剩余 1')).toBeVisible()
  })

  it('completes the fixed batch when all remaining members become externally mastered', async () => {
    const { props, rerender } = await startWithGoal(2)
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001']} />)
    expect(screen.queryByRole('dialog', { name: '本轮背诵完成' })).not.toBeInTheDocument()
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001', 'word-0002']} />)
    expect(screen.getByText('本轮目标 2 · 剩余 0')).toBeVisible()
    expect(screen.queryByRole('list', { name: '单词列表' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: '本轮背诵完成' })).toBeVisible()
    expect(props.onMarkMastered).not.toHaveBeenCalled()
  })

  it('cancels random rebuilding without changing the batch, rule, search, or definitions', async () => {
    await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    await user.type(screen.getByRole('searchbox'), 'ability')
    const before = visibleWordIds()
    await user.click(screen.getByRole('button', { name: '随机单词' }))
    expect(screen.getByText('将会重新按照随机单词排序给出2个单词背诵')).toBeVisible()
    expect(screen.getByRole('button', { name: '顺序单词' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(visibleWordIds()).toEqual(before)
    expect(screen.getByRole('searchbox')).toHaveValue('ability')
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
  })

  it('only instructs on initial mode, confirms a concrete letter, and uses actual available count', async () => {
    await startWithGoal(4)
    await user.click(screen.getByRole('button', { name: '按首字母' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('请选择下方具体字母')).toBeVisible()
    expect(screen.getByRole('button', { name: '顺序单词' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: '字母 Z' }))
    expect(screen.getByText('当前最多可提供1个。')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    expect(visibleWordIds()).toEqual(['word-0004'])
    expect(screen.getByText('本轮目标 1 · 剩余 1')).toBeVisible()
    expect(screen.getByRole('button', { name: '字母 Z' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates pending availability from latest mastery and blocks empty rebuilds', async () => {
    const { props, rerender } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '字母 Z' }))
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0004']} />)
    expect(screen.getByText('该条件下暂无可背单词')).toBeVisible()
    expect(screen.getByRole('button', { name: '确认重新生成' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
  })

  it('requests confirmation when clicking the active concrete letter during study', async () => {
    await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '字母 A' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    await user.click(screen.getByRole('button', { name: '字母 A' }))
    expect(screen.getByRole('dialog', { name: '重新生成本轮单词？' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
  })

  it('recomputes candidates on confirmation when mastery changes while pending', async () => {
    const { props, rerender } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '字母 A' }))
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001']} />)
    expect(screen.getByText('当前最多可提供1个。')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    expect(visibleWordIds()).toEqual(['word-0002'])
    expect(screen.getByText('本轮目标 1 · 剩余 1')).toBeVisible()
  })

  it('advances the random seed only on confirmation, clears search, and restores definitions', async () => {
    await startWithGoal(4)
    await user.click(screen.getByRole('button', { name: '随机单词' }))
    await user.click(screen.getByRole('button', { name: '取消' }))
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    await user.type(screen.getByRole('searchbox'), 'ability')
    await user.click(screen.getByRole('button', { name: '随机单词' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    expect(visibleWordIds()).toEqual(shuffleWords(words, 24).map((entry) => entry.id))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByText('能力')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '重新随机' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    expect(visibleWordIds()).toEqual(shuffleWords(words, 25).map((entry) => entry.id))
  })

  it('does not import words outside the batch when searching', async () => {
    await startWithGoal(2)
    await user.type(screen.getByRole('searchbox'), 'book')
    expect(screen.queryByText('book', { exact: true })).not.toBeInTheDocument()
    expect(screen.getByText('本轮目标 2 · 剩余 2')).toBeVisible()
    expect(screen.queryByRole('dialog', { name: '本轮背诵完成' })).not.toBeInTheDocument()
    await user.clear(screen.getByRole('searchbox'))
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
  })

  it('cancels a reset without modifying current learning state', async () => {
    await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    await user.type(screen.getByRole('searchbox'), 'ability')
    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    await user.clear(screen.getByRole('spinbutton'))
    await user.type(screen.getByRole('spinbutton'), '1')
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(screen.getByRole('searchbox')).toHaveValue('ability')
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
    expect(screen.getByText('本轮目标 2 · 剩余 2')).toBeVisible()
  })

  it('starts a reset using the current rule and restores visible definitions', async () => {
    await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '字母 A' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    await user.type(screen.getByRole('searchbox'), 'able')
    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    await enterGoal(1)
    expect(visibleWordIds()).toEqual(['word-0001'])
    expect(screen.getByRole('button', { name: '字母 A' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByText('能力')).toBeVisible()
    expect(screen.getByText('本轮目标 1 · 剩余 1')).toBeVisible()
  })

  it('limits a letter-rule reset to that letter and offers an escape when the letter is exhausted', async () => {
    const { props, rerender } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '字母 Z' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    expect(screen.getByText('当前有1个单词可供背诵。')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '取消' }))
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0004']} />)
    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    expect(screen.getByText('当前首字母下暂无可背单词')).toBeVisible()
    expect(screen.getByText('可取消后在本轮完成提示中选择继续背，新目标将按顺序单词开始。')).toBeVisible()
    expect(screen.getByRole('button', { name: '取消' })).toBeVisible()
  })

  it('keeps reset cancellable when candidates become exhausted while it is open', async () => {
    const { props, rerender } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '重新设定目标' }))
    rerender(<WordQuickStudy {...props} masteredWordIds={words.map((word) => word.id)} />)
    expect(screen.getByRole('dialog', { name: '全部单词已掌握' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(screen.queryByRole('dialog', { name: '全部单词已掌握' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: '本轮背诵完成' })).toBeVisible()
    expect(screen.getByText('本轮目标 2 · 剩余 0')).toBeVisible()
    expect(props.onBack).not.toHaveBeenCalled()
  })

  it('temporarily views all mastered words and restores the exact batch and search', async () => {
    const { props } = await startWithGoal(1, { masteredWordIds: ['word-0003', 'word-0004'] })
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    await user.type(screen.getByRole('searchbox'), 'ability')
    await user.click(screen.getByRole('button', { name: '已掌握单词' }))
    expect(visibleWordIds()).toEqual(['word-0003', 'word-0004'])
    await user.click(screen.getByRole('button', { name: '取消掌握 book' }))
    expect(props.onUnmarkMastered).toHaveBeenCalledWith('word-0003')
    await user.type(screen.getByRole('searchbox'), 'zero')
    await user.click(screen.getByRole('button', { name: '返回本轮单词' }))
    expect(visibleWordIds()).toEqual(['word-0001'])
    expect(screen.getByRole('searchbox')).toHaveValue('ability')
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
  })

  it.each(['顺序单词', '随机单词', '字母 A'])('restores the batch by clicking its active rule %s in mastered view', async (button) => {
    await startWithGoal(2, { masteredWordIds: ['word-0004'] })
    if (button !== '顺序单词') {
      await user.click(screen.getByRole('button', { name: button }))
      await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    }
    const before = visibleWordIds()
    await user.click(screen.getByRole('button', { name: '已掌握单词' }))
    await user.click(screen.getByRole('button', { name: button }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(visibleWordIds()).toEqual(before)
  })

  it('provides the all-mastered entry state and allows reviewing without a batch', async () => {
    render(<WordQuickStudy {...createProps({ masteredWordIds: words.map((word) => word.id) })} />)
    expect(screen.getByRole('dialog', { name: '全部单词已掌握' })).toBeVisible()
    expect(screen.queryByRole('list', { name: '单词列表' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '查看已掌握单词' }))
    expect(visibleWordIds()).toEqual(words.map((word) => word.id))
    expect(screen.queryByRole('dialog', { name: '本轮背诵完成' })).not.toBeInTheDocument()
  })

  it('opens completion and continues with a fresh default goal and ordered rule', async () => {
    const { props, rerender } = await startWithGoal(1)
    await user.click(screen.getByRole('button', { name: '字母 Z' }))
    await user.click(screen.getByRole('button', { name: '确认重新生成' }))
    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 zero' }))
      rerender(<WordQuickStudy {...props} masteredWordIds={['word-0004']} />)
      await act(async () => { vi.advanceTimersByTime(800) })
    } finally {
      vi.useRealTimers()
    }
    expect(screen.getByRole('dialog', { name: '本轮背诵完成' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: '继续背' }))
    expect(screen.getByRole('spinbutton')).toHaveValue(30)
    expect(screen.queryByRole('dialog', { name: '本轮背诵完成' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '取消' })).not.toBeInTheDocument()
    await enterGoal(2)
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
    expect(screen.getByRole('button', { name: '顺序单词' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps fixed back available from the continue goal', async () => {
    const { props } = await startWithGoal(1)
    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      await act(async () => { vi.advanceTimersByTime(800) })
    } finally {
      vi.useRealTimers()
    }
    await user.click(screen.getByRole('button', { name: '继续背' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: '返回今日学习' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })

  it('returns home when the learner chooses to rest after completion', async () => {
    const { props } = await startWithGoal(1)
    vi.useFakeTimers()
    try {
      fireEvent.click(screen.getByRole('button', { name: '已掌握 ability' }))
      await act(async () => { vi.advanceTimersByTime(800) })
    } finally {
      vi.useRealTimers()
    }
    await user.click(screen.getByRole('button', { name: '先休息一下' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })
})
