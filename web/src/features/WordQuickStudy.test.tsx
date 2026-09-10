import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WordEntry } from '../domain/word'
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
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    vi.spyOn(Date, 'now').mockReturnValue(23)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('applies a confirmed batch limit and keeps row definition, audio, and mastery controls independent', async () => {
    const user = userEvent.setup()
    const props = createProps()
    const { rerender } = render(<WordQuickStudy {...props} />)

    await user.clear(screen.getByLabelText('本次背诵数量'))
    await user.type(screen.getByLabelText('本次背诵数量'), '2')
    expect(screen.getByText('book')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '确定数量' }))

    expect(screen.getByText('ability')).toBeInTheDocument()
    expect(screen.getByText('able')).toBeInTheDocument()
    expect(screen.queryByText('book')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    expect(screen.queryByText('能力')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
    expect(screen.getByText('能力')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '播放 ability 的美式发音' }))
    expect(screen.getByTestId('word-audio')).toHaveAttribute('src', '/audio/words/0001.mp3')
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce()

    await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
    expect(props.onMarkMastered).toHaveBeenCalledWith('word-0001')
    rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001']} />)
    expect(screen.queryByText('ability')).not.toBeInTheDocument()
  })

  it('shows all mastered words and lets the learner undo an accidental mastery action', async () => {
    const user = userEvent.setup()
    const props = createProps({ masteredWordIds: ['word-0001', 'word-0002'] })
    render(<WordQuickStudy {...props} />)

    await user.clear(screen.getByLabelText('本次背诵数量'))
    await user.type(screen.getByLabelText('本次背诵数量'), '1')
    await user.click(screen.getByRole('button', { name: '确定数量' }))
    await user.click(screen.getByRole('button', { name: '已掌握单词' }))

    expect(screen.getByText('ability')).toBeInTheDocument()
    expect(screen.getByText('able')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '取消掌握 ability' }))
    expect(props.onUnmarkMastered).toHaveBeenCalledWith('word-0001')
  })

  it('filters by initial and produces a new deterministic order when rerandomized', async () => {
    const user = userEvent.setup()
    render(<WordQuickStudy {...createProps()} />)

    await user.click(screen.getByRole('button', { name: '按首字母' }))
    await user.click(screen.getByRole('button', { name: '字母 A' }))
    expect(screen.getByText('ability')).toBeInTheDocument()
    expect(screen.getByText('able')).toBeInTheDocument()
    expect(screen.queryByText('book')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '随机单词' }))
    const firstOrder = within(screen.getByRole('list', { name: '单词列表' }))
      .getAllByRole('listitem')
      .map((row) => row.getAttribute('data-word-id'))
    await user.click(screen.getByRole('button', { name: '重新随机' }))
    const secondOrder = within(screen.getByRole('list', { name: '单词列表' }))
      .getAllByRole('listitem')
      .map((row) => row.getAttribute('data-word-id'))

    expect(secondOrder).not.toEqual(firstOrder)
  })
})
