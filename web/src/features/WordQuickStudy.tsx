import { useMemo, useRef, useState } from 'react'
import { FixedBackButton } from '../components/FixedBackButton'
import { getWordCandidates } from '../domain/word-selection'
import { completeWordInBatch, createWordStudyBatch, selectBatchWords, type WordBatchRule, type WordStudyBatch } from '../domain/word-study-batch'
import { getWordAudioPath, type WordEntry } from '../domain/word'
import { WordBatchChangeDialog, WordBatchCompleteDialog, WordGoalDialog } from './word-study/WordStudyDialogs'
import './WordQuickStudy.css'

export interface WordQuickStudyProps {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  onBack: () => void
  onMarkMastered: (wordId: string) => void
  onUnmarkMastered: (wordId: string) => void
}

const LETTERS = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))
type GoalDialogContext = 'initial' | 'reset' | 'continue' | null

function sameRule(left: WordBatchRule, right: WordBatchRule) {
  if (left.kind !== right.kind) return false
  if (left.kind === 'initial' && right.kind === 'initial') return left.initial === right.initial
  if (left.kind === 'random' && right.kind === 'random') return left.seed === right.seed
  return true
}

function ruleDescription(rule: WordBatchRule, size: number) {
  const label = rule.kind === 'initial' ? `首字母${rule.initial}` : rule.kind === 'random' ? '随机单词' : '顺序单词'
  return `将会重新按照${label}排序给出${size}个单词背诵`
}

export function WordQuickStudy({
  words,
  masteredWordIds,
  onBack,
  onMarkMastered,
  onUnmarkMastered,
}: WordQuickStudyProps) {
  const [batch, setBatch] = useState<WordStudyBatch | null>(null)
  const [goalDialogContext, setGoalDialogContext] = useState<GoalDialogContext>('initial')
  const [pendingRule, setPendingRule] = useState<WordBatchRule | null>(null)
  const [viewingMastered, setViewingMastered] = useState(false)
  const [query, setQuery] = useState('')
  const [masteredQuery, setMasteredQuery] = useState('')
  const [initialInstruction, setInitialInstruction] = useState(false)
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now())
  const [hiddenDefinitionIds, setHiddenDefinitionIds] = useState<Set<string>>(() => new Set())
  const batchVersionRef = useRef(0)
  const [audioPath, setAudioPath] = useState('')
  const [audioError, setAudioError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const masteredSet = useMemo(() => new Set(masteredWordIds), [masteredWordIds])

  const availableCount = useMemo(() => getWordCandidates({
    words, masteredWordIds, mode: 'ordered', query: '',
  }).length, [words, masteredWordIds])
  const pendingAvailableCount = useMemo(() => pendingRule ? getWordCandidates({
    words, masteredWordIds, mode: pendingRule.kind, query: '',
    initial: pendingRule.kind === 'initial' ? pendingRule.initial : undefined,
    shuffleSeed: pendingRule.kind === 'random' ? pendingRule.seed : undefined,
  }).length : 0, [words, masteredWordIds, pendingRule])
  const visibleWords = viewingMastered
    ? getWordCandidates({ words, masteredWordIds, mode: 'mastered', query: masteredQuery })
    : batch ? selectBatchWords(batch, words, query) : []
  const activeRule = batch?.rule

  const letterCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const entry of words) {
      if (masteredSet.has(entry.id)) continue
      const letter = entry.word[0]?.toUpperCase()
      if (letter) counts.set(letter, (counts.get(letter) ?? 0) + 1)
    }
    return counts
  }, [masteredSet, words])

  function startBatch(requestedSize: number, rule: WordBatchRule) {
    const result = createWordStudyBatch({ words, masteredWordIds, requestedSize, rule })
    if (result.availableCount === 0) return
    batchVersionRef.current += 1
    setBatch(result.batch)
    setQuery('')
    setMasteredQuery('')
    setHiddenDefinitionIds(new Set())
    if (rule.kind === 'random') setShuffleSeed(rule.seed)
    setViewingMastered(false)
    setInitialInstruction(false)
    setPendingRule(null)
    setGoalDialogContext(null)
  }

  function requestMode(kind: 'ordered' | 'random') {
    if (!batch) {
      setGoalDialogContext('initial')
      return
    }
    if (viewingMastered && batch.rule.kind === kind) {
      setViewingMastered(false)
      return
    }
    const rule: WordBatchRule = kind === 'random'
      ? { kind: 'random', seed: shuffleSeed + 1 }
      : { kind: 'ordered' }
    if (!viewingMastered && sameRule(batch.rule, rule) && kind !== 'random') return
    setPendingRule(rule)
  }

  function requestInitial(initial: string) {
    if (!batch) return
    const rule: WordBatchRule = { kind: 'initial', initial }
    if (viewingMastered && sameRule(batch.rule, rule)) {
      setViewingMastered(false)
      return
    }
    setPendingRule(rule)
  }

  function viewMastered() {
    setMasteredQuery('')
    setViewingMastered(true)
    setGoalDialogContext(null)
  }

  function markMastered(wordId: string) {
    setBatch((current) => current ? completeWordInBatch(current, wordId) : current)
    onMarkMastered(wordId)
  }

  function toggleDefinition(wordId: string) {
    setHiddenDefinitionIds((current) => {
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

  const allUnmasteredAreMastered = !viewingMastered && availableCount === 0

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
            <button aria-pressed={!viewingMastered && activeRule?.kind === 'ordered'} onClick={() => requestMode('ordered')} type="button">顺序单词</button>
            <button aria-pressed={!viewingMastered && activeRule?.kind === 'initial'} onClick={() => setInitialInstruction(true)} type="button">按首字母</button>
            <button aria-pressed={!viewingMastered && activeRule?.kind === 'random'} onClick={() => requestMode('random')} type="button">随机单词</button>
            <button aria-pressed={viewingMastered} onClick={viewMastered} type="button">已掌握单词</button>
          </div>
          {initialInstruction && <p className="word-filter-instruction" role="status">请选择下方具体字母</p>}

          <div className="word-letter-index" aria-label="首字母索引">
            {LETTERS.map((letter) => (
              <button
                aria-label={`字母 ${letter}`}
                aria-pressed={!viewingMastered && activeRule?.kind === 'initial' && activeRule.initial === letter}
                disabled={(letterCounts.get(letter) ?? 0) === 0}
                key={letter}
                onClick={() => requestInitial(letter)}
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
              <h2 id="word-list-heading">{viewingMastered ? '已掌握单词' : '本次单词'}</h2>
              {batch && <p className="word-batch-progress">本轮目标 {batch.actualSize} · 剩余 {batch.remainingWordIds.length}</p>}
              <p>当前显示 {visibleWords.length} 个</p>
            </div>
            <div className="word-list-controls">
              <label className="word-search-field">
                <span>搜索单词或释义</span>
                <input onChange={(event) => viewingMastered ? setMasteredQuery(event.target.value) : setQuery(event.target.value)} placeholder="输入英文或中文" type="search" value={viewingMastered ? masteredQuery : query} />
              </label>
              {viewingMastered && batch && (
                <button className="word-session-button" onClick={() => setViewingMastered(false)} type="button">返回本轮单词</button>
              )}
              {!viewingMastered && activeRule?.kind === 'random' && (
                <button className="word-rerandom-button" onClick={() => requestMode('random')} type="button">重新随机</button>
              )}
              <button className="word-session-button" onClick={() => setGoalDialogContext(batch ? 'reset' : 'initial')} type="button">重新设定目标</button>
            </div>
          </div>

          {visibleWords.length > 0 ? (
            <ul aria-label="单词列表" className="word-list">
              {visibleWords.map((entry) => {
                const definitionVisible = !hiddenDefinitionIds.has(entry.id)
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
                      onClick={() => isMastered ? onUnmarkMastered(entry.id) : markMastered(entry.id)}
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
          <audio data-testid="word-audio" onError={() => setAudioError('音频暂不可播放')} preload="none" ref={audioRef} src={audioPath || undefined} />
          {audioError && <p className="word-audio-error" role="alert">{audioError}</p>}
        </section>
      </div>
      {goalDialogContext && (
        <WordGoalDialog
          availableCount={availableCount}
          canCancel={goalDialogContext === 'reset'}
          key={goalDialogContext}
          onBack={onBack}
          onCancel={() => setGoalDialogContext(null)}
          onStart={(size) => startBatch(size, goalDialogContext === 'reset' ? batch?.rule ?? { kind: 'ordered' } : { kind: 'ordered' })}
          onViewMastered={viewMastered}
        />
      )}
      {pendingRule && batch && (
        <WordBatchChangeDialog
          availableCount={pendingAvailableCount}
          description={ruleDescription(pendingRule, batch.requestedSize)}
          requestedSize={batch.requestedSize}
          onCancel={() => setPendingRule(null)}
          onConfirm={() => startBatch(batch.requestedSize, pendingRule)}
        />
      )}
      {batch && batch.remainingWordIds.length === 0 && !viewingMastered && !goalDialogContext && !pendingRule && (
        <WordBatchCompleteDialog onContinue={() => setGoalDialogContext('continue')} onRest={onBack} />
      )}
    </main>
  )
}
