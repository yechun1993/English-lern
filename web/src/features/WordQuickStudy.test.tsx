import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('WordQuickStudy', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(Date, 'now').mockReturnValue(23)
  })

  afterEach(() => vi.restoreAllMocks())

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
    await user.click(screen.getByRole('button', { name: '返回今日学习' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })

  it('does not replenish a fixed batch after immediate mastery', async () => {
    const { props } = await startWithGoal(2)
    await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
    expect(props.onMarkMastered).toHaveBeenCalledWith('word-0001')
    expect(visibleWordIds()).toEqual(['word-0002'])
    expect(screen.queryByText('book', { exact: true })).not.toBeInTheDocument()
    expect(screen.getByText('本轮目标 2 · 剩余 1')).toBeVisible()
  })

  it('keeps audio and definition controls independent', async () => {
    await startWithGoal(2)
    expect(screen.getByTestId('word-audio')).not.toHaveAttribute('src')
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '播放 ability 的美式发音' }))
    expect(screen.getByTestId('word-audio')).toHaveAttribute('src', '/audio/words/0001.mp3')
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
    expect(visibleWordIds()).toEqual(['word-0001', 'word-0002'])
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
    await user.click(screen.getByRole('button', { name: '已掌握 zero' }))
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0004']} />)
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
    await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
    await user.click(screen.getByRole('button', { name: '继续背' }))
    await user.click(screen.getByRole('button', { name: '返回今日学习' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })

  it('returns home when the learner chooses to rest after completion', async () => {
    const { props } = await startWithGoal(1)
    await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
    await user.click(screen.getByRole('button', { name: '先休息一下' }))
    expect(props.onBack).toHaveBeenCalledOnce()
  })
})
