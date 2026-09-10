import { type FormEvent, useMemo, useRef, useState } from 'react'
import { FixedBackButton } from '../components/FixedBackButton'
import { countAvailableWords, selectWords } from '../domain/word-selection'
import { getWordAudioPath, type WordBrowseMode, type WordEntry } from '../domain/word'
import './WordQuickStudy.css'

export interface WordQuickStudyProps {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  onBack: () => void
  onMarkMastered: (wordId: string) => void
  onUnmarkMastered: (wordId: string) => void
}

const LETTERS = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))

export function WordQuickStudy({
  words,
  masteredWordIds,
  onBack,
  onMarkMastered,
  onUnmarkMastered,
}: WordQuickStudyProps) {
  const [mode, setMode] = useState<WordBrowseMode>('ordered')
  const [initial, setInitial] = useState('A')
  const [query, setQuery] = useState('')
  const [limitInput, setLimitInput] = useState('30')
  const [limit, setLimit] = useState(30)
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now())
  const [visibleDefinitions, setVisibleDefinitions] = useState(
    () => new Set(words.map((entry) => entry.id)),
  )
  const [audioPath, setAudioPath] = useState('')
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const masteredSet = useMemo(() => new Set(masteredWordIds), [masteredWordIds])

  const selectionInput = {
    words,
    masteredWordIds,
    mode,
    initial,
    query,
    limit,
    shuffleSeed,
  }
  const availableCount = countAvailableWords(selectionInput)
  const visibleWords = selectWords(selectionInput)

  const letterCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of words) {
      if (masteredSet.has(entry.id)) continue
      const letter = entry.word[0]?.toUpperCase()
      if (letter) counts.set(letter, (counts.get(letter) ?? 0) + 1)
    }
    return counts
  }, [masteredSet, words])

  function applyLimit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const requestedLimit = Math.max(
      1,
      Math.min(Math.trunc(Number(limitInput) || 30), availableCount || words.length || 1),
    )
    setLimit(requestedLimit)
    setLimitInput(String(requestedLimit))
  }

  function selectMode(nextMode: WordBrowseMode) {
    setMode(nextMode)
    if (nextMode === 'random') setShuffleSeed((seed) => seed + 1)
  }

  function selectInitial(letter: string) {
    setInitial(letter)
    setMode('initial')
  }

  function toggleDefinition(wordId: string) {
    setVisibleDefinitions((current) => {
      const next = new Set(current)
      if (next.has(wordId)) next.delete(wordId)
      else next.add(wordId)
      return next
    })
  }

  function playAudio(entry: WordEntry) {
    const nextPath = getWordAudioPath(entry.index)
    setAudioError(null)
    setAudioPath(nextPath)

    if (audioRef.current) {
      audioRef.current.setAttribute('src', nextPath)
      audioRef.current.currentTime = 0
      void audioRef.current.play().catch(() => setAudioError('音频暂不可播放'))
    }
  }

  const allUnmasteredAreMastered = mode !== 'mastered'
    && masteredWordIds.length === words.length

  return (
    <main className="word-study-shell">
      <FixedBackButton label="返回今日学习" onBack={onBack} />
      <header className="word-study-header">
        <div>
          <p className="eyebrow">高频词汇 · 本地美式发音</p>
          <h1>单词速记</h1>
          <p>点击单词区域隐藏或显示中文；确认掌握后，它会自动退出当前学习列表。</p>
        </div>
        <div className="word-study-summary" aria-label="单词学习统计">
          <strong>{words.length}</strong>
          <span>词表总数</span>
          <strong>{masteredWordIds.length}</strong>
          <span>已掌握</span>
        </div>
      </header>

      <div className="word-study-layout">
        <aside className="word-filter-sidebar" aria-label="单词筛选">
          <div className="word-filter-modes">
            <button aria-pressed={mode === 'ordered'} onClick={() => selectMode('ordered')} type="button">顺序单词</button>
            <button aria-pressed={mode === 'initial'} onClick={() => selectMode('initial')} type="button">按首字母</button>
            <button aria-pressed={mode === 'random'} onClick={() => selectMode('random')} type="button">随机单词</button>
            <button aria-pressed={mode === 'mastered'} onClick={() => selectMode('mastered')} type="button">已掌握单词</button>
          </div>

          <div className="word-letter-index" aria-label="首字母索引">
            {LETTERS.map((letter) => (
              <button
                aria-label={`字母 ${letter}`}
                aria-pressed={mode === 'initial' && initial === letter}
                disabled={(letterCounts.get(letter) ?? 0) === 0}
                key={letter}
                onClick={() => selectInitial(letter)}
                type="button"
              >
                <span>{letter}</span>
                <small>{letterCounts.get(letter) ?? 0}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="word-list-panel" aria-labelledby="word-list-heading">
          <div className="word-list-toolbar">
            <div>
              <h2 id="word-list-heading">本次单词</h2>
              <p>找到 {availableCount} 个，当前显示 {visibleWords.length} 个</p>
            </div>
            <div className="word-list-controls">
              <label className="word-search-field">
                <span>搜索单词或释义</span>
                <input onChange={(event) => setQuery(event.target.value)} placeholder="输入英文或中文" type="search" value={query} />
              </label>
              {mode === 'random' && (
                <button className="word-rerandom-button" onClick={() => setShuffleSeed((seed) => seed + 1)} type="button">重新随机</button>
              )}
              <form className="word-limit-form" onSubmit={applyLimit}>
                <label htmlFor="word-limit">本次背诵数量</label>
                <input id="word-limit" inputMode="numeric" min="1" onChange={(event) => setLimitInput(event.target.value)} type="number" value={limitInput} />
                <button type="submit">确定数量</button>
              </form>
            </div>
          </div>

          {visibleWords.length > 0 ? (
            <ul aria-label="单词列表" className="word-list">
              {visibleWords.map((entry) => {
                const definitionVisible = visibleDefinitions.has(entry.id)
                const isMastered = masteredSet.has(entry.id)
                return (
                  <li className="word-row" data-word-id={entry.id} key={entry.id}>
                    <span className="word-index">{entry.index}</span>
                    <button
                      aria-expanded={definitionVisible}
                      aria-label={`切换 ${entry.word} 的释义显示`}
                      className="word-learning-area"
                      onClick={() => toggleDefinition(entry.id)}
                      type="button"
                    >
                      <span className="word-primary">
                        <strong>{entry.word}</strong>
                        {entry.phonetic && <small>{entry.phonetic}</small>}
                      </span>
                      {definitionVisible && <span className="word-meaning">{entry.meaning}</span>}
                    </button>
                    <button
                      aria-label={`播放 ${entry.word} 的美式发音`}
                      className="word-audio-button"
                      onClick={() => playAudio(entry)}
                      type="button"
                    >
                      <span aria-hidden="true">🔊</span>
                    </button>
                    <button
                      aria-label={isMastered ? `取消掌握 ${entry.word}` : `已掌握 ${entry.word}`}
                      className={`word-mastered-button${isMastered ? ' is-mastered' : ''}`}
                      onClick={() => isMastered ? onUnmarkMastered(entry.id) : onMarkMastered(entry.id)}
                      type="button"
                    >
                      {isMastered ? '取消掌握' : '已掌握'}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="word-empty-state">
              <h3>暂无符合条件的单词</h3>
              <p>{allUnmasteredAreMastered ? '全部单词已标记掌握，可查看已掌握单词。' : '调整筛选条件后再试。'}</p>
            </div>
          )}
          <audio data-testid="word-audio" onError={() => setAudioError('音频暂不可播放')} preload="none" ref={audioRef} src={audioPath} />
          {audioError && <p className="word-audio-error" role="alert">{audioError}</p>}
        </section>
      </div>
    </main>
  )
}
