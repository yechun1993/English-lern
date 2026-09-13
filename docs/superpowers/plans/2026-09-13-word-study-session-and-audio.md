# 单词定额学习批次与即时语音 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 发布公开版 v1.2.0，移除首页考试倒计时，并把单词速记升级为目标弹窗、固定不递补批次、可靠本地语音、释义提示、掌握烟花和完成后休息/继续流程。

**Architecture:** 用纯领域模块冻结本轮单词 ID，React 页面只管理弹窗、浏览视图和动画状态；音频由可注入依赖的控制器统一负责预读、换源、并发令牌与资源释放。现有 1,911 个 MP3、已掌握 LocalStorage 仓库和全词表筛选逻辑继续复用，不重新生成音频。

**Tech Stack:** React 19、TypeScript 6、Vitest、Testing Library、Playwright + Microsoft Edge、Vite PWA、Node.js 本地静态服务器、7-Zip。

## Global Constraints

- 所有用户可见文案使用简体中文。
- 公开版首页不得显示考试日期、距离考试天数或倒计时卡片。
- 每次进入单词页必须先设定目标；默认值 `30` 初始灰色，编辑后黑色。
- 当前批次是固定 ID 快照；掌握后不补入新词。
- 顺序、随机和具体首字母重建批次前必须确认；取消不改变任何当前状态。
- “已掌握单词”只临时浏览全局队列，不破坏当前批次。
- 本轮完成副标题必须是“建议劳逸结合，不要急功近利哦～”。
- 音频只使用现有 `/audio/words/<四位序号>.mp3`，不得引入 Web Speech、外部接口或新音色。
- 掌握烟花约 `800ms`、无声音、无第三方动画依赖，并尊重 `prefers-reduced-motion`。
- 不修改题库 780 道内容，不修改个人授权版本，不覆盖 v1.0.0 或 v1.1.0 Release。
- 所有行为变更按 TDD 顺序实施：先写失败测试并确认失败，再写最小实现。

---

## File Map

| 文件 | 职责 |
| --- | --- |
| `web/src/App.tsx`、`web/src/App.css`、`web/src/App.test.tsx` | 移除公开首页考试时间与倒计时。 |
| `web/src/domain/word-selection.ts`、`.test.ts` | 导出可复用的全词表候选选择。 |
| `web/src/domain/word-study-batch.ts`、`.test.ts` | 创建固定批次、完成单词、仅在批次内搜索。 |
| `web/src/features/word-study/WordStudyDialogs.tsx`、`.css`、`.test.tsx` | 目标、规则确认和批次完成三个弹窗。 |
| `web/src/features/word-study/word-audio-player.ts`、`.test.ts` | 音频预读、播放令牌、状态和资源释放。 |
| `web/src/features/word-study/useWordAudioPlayer.ts` | 把播放器控制器接入 React 生命周期。 |
| `web/src/features/word-study/WordMasteryBurst.tsx`、`.test.tsx` | 小烟花粒子与减少动态效果检测。 |
| `web/src/features/WordQuickStudy.tsx`、`.css`、`.test.tsx` | 固定批次状态机、筛选视图、单词行和全部交互整合。 |
| `web/e2e/word-quick-study.spec.ts` | Edge 桌面与平板用户流程。 |
| `tools/public-release/package-lib.mjs`、`.test.mjs` | 将公开包版本升级到 v1.2.0。 |
| `web/README.md`、`docs/release-notes/v1.2.0.md` | 使用说明和 GitHub Release 文案。 |

---

### Task 1: Remove the Public Exam Countdown

**Files:**
- Modify: `web/src/App.test.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.css`

**Interfaces:**
- Consumes: existing dashboard render.
- Produces: public dashboard with no `考试倒计时`, `10 月 17 日`, or remaining-day calculation.

- [ ] **Step 1: Write the failing dashboard test**

Add to the first `App` test:

```tsx
expect(screen.queryByLabelText('考试倒计时')).not.toBeInTheDocument()
expect(screen.queryByText(/10 月 17 日/)).not.toBeInTheDocument()
```

- [ ] **Step 2: Run the test and verify the current public countdown fails it**

Run:

```powershell
npm run test:run -- src/App.test.tsx --reporter=dot
```

Expected: FAIL because `考试倒计时` is still present.

- [ ] **Step 3: Remove countdown rendering and dead runtime code**

In `App.tsx` remove:

```tsx
import { daysUntilExam } from './domain/exam-date'
const remainingDays = daysUntilExam(new Date())
```

Remove this dashboard block:

```tsx
<div className="exam-countdown" aria-label="考试倒计时">
  <span>距离 10 月 17 日</span>
  <strong>{remainingDays} 天</strong>
</div>
```

Delete `.exam-countdown`, `.exam-countdown strong`, and the narrow-screen `.exam-countdown` rules from `App.css`. Keep `.header-actions` wrapping the two remaining entry buttons.

- [ ] **Step 4: Verify and commit**

Run:

```powershell
npm run test:run -- src/App.test.tsx --reporter=dot
npm run lint
```

Expected: App tests pass and lint reports no errors.

Commit:

```powershell
git add web/src/App.tsx web/src/App.css web/src/App.test.tsx
git commit -m "fix: hide public exam countdown"
```

---

### Task 2: Freeze Word Study Batches in the Domain Layer

**Files:**
- Modify: `web/src/domain/word-selection.ts`
- Modify: `web/src/domain/word-selection.test.ts`
- Create: `web/src/domain/word-study-batch.ts`
- Create: `web/src/domain/word-study-batch.test.ts`

**Interfaces:**
- Produces: `WordBatchRule`, `WordStudyBatch`, `createWordStudyBatch`, `completeWordInBatch`, `selectBatchWords`, and exported `getWordCandidates`.
- Consumes: `WordEntry`, `shuffleWords`, global mastered IDs.

- [ ] **Step 1: Write failing candidate and fixed-batch tests**

Add an export assertion in `word-selection.test.ts`, then create `word-study-batch.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { WordEntry } from './word'
import {
  completeWordInBatch,
  createWordStudyBatch,
  selectBatchWords,
} from './word-study-batch'

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能够', note: null },
  { id: 'word-0003', index: 3, word: 'book', phonetic: null, meaning: '书', note: null },
  { id: 'word-0004', index: 4, word: 'zero', phonetic: null, meaning: '零', note: null },
]

describe('word study batch', () => {
  it('freezes the requested ordered words and never replenishes after mastery', () => {
    const result = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'ordered' },
    })
    expect(result.batch.wordIds).toEqual(['word-0001', 'word-0002'])
    expect(result.batch.remainingWordIds).toEqual(['word-0001', 'word-0002'])

    const next = completeWordInBatch(result.batch, 'word-0001')
    expect(next.remainingWordIds).toEqual(['word-0002'])
    expect(next.remainingWordIds).not.toContain('word-0003')
  })

  it('uses the actual candidate count when a letter has fewer words than the goal', () => {
    const result = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 30,
      rule: { kind: 'initial', initial: 'Z' },
    })
    expect(result.availableCount).toBe(1)
    expect(result.batch.requestedSize).toBe(30)
    expect(result.batch.actualSize).toBe(1)
    expect(result.batch.wordIds).toEqual(['word-0004'])
  })

  it('searches only remaining words from the frozen batch', () => {
    const batch = createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'ordered' },
    }).batch
    expect(selectBatchWords(batch, words, '书')).toEqual([])
    expect(selectBatchWords(batch, words, '能力').map((entry) => entry.id)).toEqual(['word-0001'])
  })

  it('rejects invalid sizes and letters', () => {
    expect(() => createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 0,
      rule: { kind: 'ordered' },
    })).toThrow('单词批次参数无效。')
    expect(() => createWordStudyBatch({
      words,
      masteredWordIds: [],
      requestedSize: 2,
      rule: { kind: 'initial', initial: '!' },
    })).toThrow('单词批次参数无效。')
  })
})
```

- [ ] **Step 2: Run the tests and verify missing exports fail**

```powershell
npm run test:run -- src/domain/word-selection.test.ts src/domain/word-study-batch.test.ts --reporter=dot
```

Expected: FAIL because `word-study-batch.ts` and `getWordCandidates` do not exist.

- [ ] **Step 3: Export full candidate selection without a limit**

Refactor `word-selection.ts` so its internal candidate function becomes:

```ts
export type WordCandidateInput = Omit<WordSelectionInput, 'limit'>

function validateLimit(limit: number): void {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }
}

function validateCandidateInput(input: WordCandidateInput): void {
  if (input.mode === 'initial' && !/^[A-Z]$/.test(input.initial ?? '')) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }
  if (input.shuffleSeed !== undefined && !Number.isFinite(input.shuffleSeed)) {
    throw new Error(INVALID_SELECTION_MESSAGE)
  }
}

export function getWordCandidates(input: WordCandidateInput): WordEntry[] {
  validateCandidateInput(input)
  const mastered = new Set(input.masteredWordIds)
  let candidates = input.mode === 'mastered'
    ? input.words.filter((entry) => mastered.has(entry.id))
    : input.words.filter((entry) => !mastered.has(entry.id))

  if (input.mode === 'initial') {
    candidates = candidates.filter((entry) => entry.word[0]?.toUpperCase() === input.initial)
  }
  if (input.mode === 'random') {
    candidates = shuffleWords(candidates, input.shuffleSeed ?? 0)
  }

  const normalizedQuery = input.query.trim().toLowerCase()
  return normalizedQuery
    ? candidates.filter((entry) => entry.word.toLowerCase().includes(normalizedQuery)
      || entry.meaning.toLowerCase().includes(normalizedQuery))
    : candidates
}

export function selectWords(input: WordSelectionInput): WordEntry[] {
  validateLimit(input.limit)
  const candidates = getWordCandidates(input)
  return input.mode === 'mastered' ? candidates : candidates.slice(0, input.limit)
}

export function countAvailableWords(input: WordSelectionInput): number {
  validateLimit(input.limit)
  return getWordCandidates(input).length
}
```

Keep the existing `INVALID_SELECTION_MESSAGE = '单词筛选参数无效。'` and `shuffleWords` implementation. This preserves the old contract that mastered mode returns its complete queue even though `limit` still has to be valid.

- [ ] **Step 4: Implement the fixed batch module**

Create `word-study-batch.ts`:

```ts
import { getWordCandidates } from './word-selection'
import type { WordEntry } from './word'

export type WordBatchRule =
  | { kind: 'ordered' }
  | { kind: 'random'; seed: number }
  | { kind: 'initial'; initial: string }

export interface WordStudyBatch {
  requestedSize: number
  actualSize: number
  rule: WordBatchRule
  wordIds: readonly string[]
  remainingWordIds: readonly string[]
}

interface CreateWordStudyBatchInput {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  requestedSize: number
  rule: WordBatchRule
}

const INVALID_BATCH_MESSAGE = '单词批次参数无效。'

export function createWordStudyBatch(input: CreateWordStudyBatchInput) {
  if (!Number.isInteger(input.requestedSize) || input.requestedSize <= 0) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }
  if (input.rule.kind === 'initial' && !/^[A-Z]$/.test(input.rule.initial)) {
    throw new Error(INVALID_BATCH_MESSAGE)
  }

  const mode = input.rule.kind === 'initial' ? 'initial' : input.rule.kind
  const candidates = getWordCandidates({
    words: input.words,
    masteredWordIds: input.masteredWordIds,
    mode,
    initial: input.rule.kind === 'initial' ? input.rule.initial : undefined,
    query: '',
    shuffleSeed: input.rule.kind === 'random' ? input.rule.seed : undefined,
  })
  const selected = candidates.slice(0, input.requestedSize)
  const wordIds = selected.map((entry) => entry.id)
  return {
    availableCount: candidates.length,
    batch: {
      requestedSize: input.requestedSize,
      actualSize: wordIds.length,
      rule: input.rule,
      wordIds,
      remainingWordIds: wordIds,
    } satisfies WordStudyBatch,
  }
}

export function completeWordInBatch(batch: WordStudyBatch, wordId: string): WordStudyBatch {
  if (!batch.wordIds.includes(wordId)) return batch
  return {
    ...batch,
    remainingWordIds: batch.remainingWordIds.filter((id) => id !== wordId),
  }
}

export function selectBatchWords(
  batch: WordStudyBatch,
  words: readonly WordEntry[],
  query: string,
): WordEntry[] {
  const wordsById = new Map(words.map((entry) => [entry.id, entry]))
  const normalized = query.trim().toLowerCase()
  return batch.remainingWordIds
    .map((id) => wordsById.get(id))
    .filter((entry): entry is WordEntry => entry !== undefined)
    .filter((entry) => !normalized
      || entry.word.toLowerCase().includes(normalized)
      || entry.meaning.toLowerCase().includes(normalized))
}
```

- [ ] **Step 5: Verify domain tests and commit**

```powershell
npm run test:run -- src/domain/word-selection.test.ts src/domain/word-study-batch.test.ts --reporter=dot
npm run lint
git add web/src/domain/word-selection.ts web/src/domain/word-selection.test.ts web/src/domain/word-study-batch.ts web/src/domain/word-study-batch.test.ts
git commit -m "feat: freeze word study batches"
```

Expected: all domain tests and lint pass.

---

### Task 3: Build the Three Accessible Word Dialogs

**Files:**
- Create: `web/src/features/word-study/WordStudyDialogs.tsx`
- Create: `web/src/features/word-study/WordStudyDialogs.css`
- Create: `web/src/features/word-study/WordStudyDialogs.test.tsx`

**Interfaces:**
- Produces: `WordGoalDialog`, `WordBatchChangeDialog`, `WordBatchCompleteDialog`.
- Consumes: callbacks only; no repository or word-bank imports.

- [ ] **Step 1: Write failing dialog behavior tests**

Cover these exact assertions:

```tsx
it('starts with a gray real value 30 and turns black after editing', async () => {
  const onStart = vi.fn()
  render(<WordGoalDialog availableCount={100} canCancel={false} onBack={vi.fn()} onCancel={vi.fn()} onStart={onStart} onViewMastered={vi.fn()} />)
  const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
  expect(input).toHaveValue(30)
  expect(input).toHaveClass('is-default-value')
  await userEvent.clear(input)
  await userEvent.type(input, '12')
  expect(input).toHaveClass('is-edited-value')
  await userEvent.click(screen.getByRole('button', { name: '开背' }))
  expect(onStart).toHaveBeenCalledWith(12)
})

it('keeps the goal dialog open for invalid or excessive values', async () => {
  const onStart = vi.fn()
  render(<WordGoalDialog availableCount={8} canCancel={false} onBack={vi.fn()} onCancel={vi.fn()} onStart={onStart} onViewMastered={vi.fn()} />)
  const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
  await userEvent.clear(input)
  await userEvent.type(input, '30')
  await userEvent.click(screen.getByRole('button', { name: '开背' }))
  expect(screen.getByRole('alert')).toHaveTextContent('当前最多可背8个单词')
  expect(onStart).not.toHaveBeenCalled()
})

it('confirms or cancels a pending random batch', async () => {
  render(<WordBatchChangeDialog availableCount={1911} description="将会重新按照随机单词排序给出30个单词背诵" onCancel={onCancel} onConfirm={onConfirm} requestedSize={30} />)
  expect(screen.getByRole('dialog', { name: '重新生成本轮单词？' })).toBeVisible()
  await userEvent.click(screen.getByRole('button', { name: '取消' }))
  expect(onCancel).toHaveBeenCalledOnce()
})

it('shows the fixed completion copy and both decisions', () => {
  render(<WordBatchCompleteDialog onContinue={vi.fn()} onRest={vi.fn()} />)
  expect(screen.getByText('建议劳逸结合，不要急功近利哦～')).toBeVisible()
  expect(screen.getByRole('button', { name: '先休息一下' })).toBeVisible()
  expect(screen.getByRole('button', { name: '继续背' })).toBeVisible()
})
```

Also test `availableCount={0}` shows “全部单词已掌握” with “查看已掌握单词” and “返回今日学习”, and `canCancel={true}` renders “取消”.

- [ ] **Step 2: Run and verify module-not-found failure**

```powershell
npm run test:run -- src/features/word-study/WordStudyDialogs.test.tsx --reporter=dot
```

Expected: FAIL because the dialog module does not exist.

- [ ] **Step 3: Implement dialog components with exact props**

Use these public props:

```ts
export interface WordGoalDialogProps {
  availableCount: number
  canCancel: boolean
  onBack: () => void
  onCancel: () => void
  onStart: (requestedSize: number) => void
  onViewMastered: () => void
}

export interface WordBatchChangeDialogProps {
  availableCount: number
  description: string
  requestedSize: number
  onCancel: () => void
  onConfirm: () => void
}

export interface WordBatchCompleteDialogProps {
  onContinue: () => void
  onRest: () => void
}
```

`WordGoalDialog` owns `inputValue = '30'`, `edited = false`, and `error`. Submit only calls `onStart` for `/^\d+$/`, integer `>= 1`, and `<= availableCount`. Apply `is-default-value` before any `onChange`, otherwise `is-edited-value`. Use `<form>` so Enter activates “开背”.

Every dialog uses:

```tsx
<div className="word-dialog-backdrop">
  <section aria-labelledby={titleId} aria-modal="true" className="word-dialog" role="dialog">
    ...
  </section>
</div>
```

The rule dialog text adds `当前最多可提供${availableCount}个。` only when `availableCount < requestedSize`. Add an Escape listener only when cancellation is permitted.

- [ ] **Step 4: Add responsive dialog styling**

Implement fixed full-viewport backdrop below the public notice but above page content, a maximum dialog width of `460px`, visible focus outlines, gray/black number classes, and stacked buttons below `520px`. Do not cover the fixed back button (`z-index` must remain below `.fixed-back-button`).

- [ ] **Step 5: Verify and commit**

```powershell
npm run test:run -- src/features/word-study/WordStudyDialogs.test.tsx --reporter=dot
npm run lint
git add web/src/features/word-study/WordStudyDialogs.tsx web/src/features/word-study/WordStudyDialogs.css web/src/features/word-study/WordStudyDialogs.test.tsx
git commit -m "feat: add word study dialogs"
```

---

### Task 4: Create a Race-Safe Local Audio Player

**Files:**
- Create: `web/src/features/word-study/word-audio-player.ts`
- Create: `web/src/features/word-study/word-audio-player.test.ts`
- Create: `web/src/features/word-study/useWordAudioPlayer.ts`

**Interfaces:**
- Produces: `createWordAudioPlayer`, `WordAudioStatus`, and `useWordAudioPlayer`.
- Consumes: local MP3 paths from `getWordAudioPath` and a hidden `HTMLAudioElement` ref.

- [ ] **Step 1: Write failing controller tests with injected browser boundaries**

Create this deterministic fake and shared setup before the tests:

```ts
type AudioListener = () => void

class FakeAudio {
  src = ''
  currentTime = 0
  private listeners = new Map<string, Set<AudioListener>>()
  pause = vi.fn()
  load = vi.fn()
  play = vi.fn<() => Promise<void>>(() => Promise.resolve())

  addEventListener(type: string, listener: AudioListener) {
    const listeners = this.listeners.get(type) ?? new Set<AudioListener>()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  removeEventListener(type: string, listener: AudioListener) {
    this.listeners.get(type)?.delete(listener)
  }

  dispatch(type: string) {
    this.listeners.get(type)?.forEach((listener) => listener())
  }
}

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能够', note: null },
]

let audio: FakeAudio
let fetchAudio: ReturnType<typeof vi.fn>
let createObjectURL: ReturnType<typeof vi.fn>
let revokeObjectURL: ReturnType<typeof vi.fn>
let onStatus: ReturnType<typeof vi.fn>

beforeEach(() => {
  audio = new FakeAudio()
  fetchAudio = vi.fn(async (url: string) => new Blob([url], { type: 'audio/mpeg' }))
  createObjectURL = vi.fn((blob: Blob) => blob.size > 0 ? `blob:word-${createObjectURL.mock.calls.length.toString().padStart(4, '0')}` : 'blob:empty')
  revokeObjectURL = vi.fn()
  onStatus = vi.fn()
})
```

Then test:

```ts
it('preloads batch files with bounded concurrency and reuses the blob URL', async () => {
  const player = createWordAudioPlayer({ audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus })
  await player.preload(words)
  player.play(words[0])
  expect(audio.src).toBe('blob:word-0001')
  expect(audio.load).toHaveBeenCalledOnce()
  expect(audio.play).toHaveBeenCalledOnce()
})

it('plays an uncached local URL synchronously while preload is pending', () => {
  fetchAudio.mockImplementation(() => new Promise<Blob>(() => undefined))
  const player = createWordAudioPlayer({ audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus })
  void player.preload(words)
  player.play(words[0])
  expect(audio.src).toBe('/audio/words/0001.mp3')
  expect(audio.play).toHaveBeenCalledOnce()
})

it('allows only the latest click to publish status', async () => {
  let rejectFirstPlay!: (reason: Error) => void
  audio.play
    .mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { rejectFirstPlay = reject }))
    .mockResolvedValueOnce()
  const player = createWordAudioPlayer({ audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus })
  player.play(words[0])
  player.play(words[1])
  rejectFirstPlay(new Error('interrupted'))
  await Promise.resolve()
  audio.dispatch('playing')
  expect(onStatus).toHaveBeenLastCalledWith({ phase: 'playing', wordId: 'word-0002' })
  expect(onStatus).not.toHaveBeenLastCalledWith(expect.objectContaining({ phase: 'error' }))
})

it('stops playback, aborts preload, and revokes blobs on dispose', async () => {
  const player = createWordAudioPlayer({ audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus })
  await player.preload(words)
  player.dispose()
  expect(audio.pause).toHaveBeenCalled()
  expect(revokeObjectURL).toHaveBeenCalledWith('blob:word-0001')
})
```

In the first preload test, define `player` before use and expect both generated Blob URLs. Also add a separate rejection test where `audio.play.mockRejectedValueOnce(new Error('denied'))`, await one microtask, and assert the final call equals `{ phase: 'error', wordId: 'word-0001', message: '播放失败，请再次点击' }`.

- [ ] **Step 2: Run and verify the controller is missing**

```powershell
npm run test:run -- src/features/word-study/word-audio-player.test.ts --reporter=dot
```

Expected: FAIL because `createWordAudioPlayer` is not defined.

- [ ] **Step 3: Implement the controller**

Use these types:

```ts
export type WordAudioStatus =
  | { phase: 'idle'; wordId: null }
  | { phase: 'loading' | 'playing'; wordId: string }
  | { phase: 'error'; wordId: string; message: '播放失败，请再次点击' }

export interface WordAudioPlayer {
  preload(words: readonly WordEntry[]): Promise<void>
  play(word: WordEntry): void
  dispose(): void
}

interface AudioElementLike {
  src: string
  currentTime: number
  pause(): void
  load(): void
  play(): Promise<void>
  addEventListener(type: 'playing' | 'error' | 'ended', listener: () => void): void
  removeEventListener(type: 'playing' | 'error' | 'ended', listener: () => void): void
}

interface WordAudioPlayerDependencies {
  audio: AudioElementLike
  fetchAudio: (url: string, signal: AbortSignal) => Promise<Blob>
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
  onStatus: (status: WordAudioStatus) => void
}
```

Implementation rules:

```ts
function play(word: WordEntry) {
  const token = ++activeToken
  clearActiveListeners()
  audio.pause()
  const source = blobUrls.get(word.id) ?? getWordAudioPath(word.index)
  audio.src = source
  audio.currentTime = 0
  onStatus({ phase: 'loading', wordId: word.id })
  installLatestOnlyListeners(token, word.id)
  audio.load()
  void audio.play().catch(() => {
    if (token === activeToken) {
      onStatus({ phase: 'error', wordId: word.id, message: '播放失败，请再次点击' })
    }
  })
}
```

`preload` uses exactly this lifecycle: copy the unique words into a queue, start `Math.min(4, queue.length)` async workers, and let each worker shift until empty. Each item calls `fetchAudio(getWordAudioPath(word.index), abortController.signal)` and creates/stores one Blob URL only if the player is still active; when disposal wins the race, immediately revoke the just-created URL. Ignore preload fetch failures because direct local URL playback remains available, but rethrow neither aborts nor network errors. Multiple calls skip IDs already cached or currently queued.

`installLatestOnlyListeners(token, wordId)` registers `playing`, `error`, and `ended`; each listener reports only while `token === activeToken`. `playing` reports the word, `ended` reports `{ phase: 'idle', wordId: null }`, and the error copy is exactly `播放失败，请再次点击`. `clearActiveListeners` removes all three current callbacks. `dispose` is idempotent: mark disposed, increment the token, remove listeners, abort, pause, clear `src`, call `load`, revoke and clear every Blob URL, then report idle. `play` returns immediately without side effects after disposal.

- [ ] **Step 4: Wrap the controller in a React hook**

```ts
export function useWordAudioPlayer(
  audioRef: RefObject<HTMLAudioElement | null>,
  preloadWords: readonly WordEntry[],
) {
  const [status, setStatus] = useState<WordAudioStatus>({ phase: 'idle', wordId: null })
  const controllerRef = useRef<WordAudioPlayer | null>(null)

  useEffect(() => {
    if (!audioRef.current) return
    const controller = createWordAudioPlayer({
      audio: audioRef.current,
      fetchAudio: async (url, signal) => {
        const response = await fetch(url, { signal })
        if (!response.ok) throw new Error(`audio ${response.status}`)
        return response.blob()
      },
      createObjectURL: URL.createObjectURL,
      revokeObjectURL: URL.revokeObjectURL,
      onStatus: setStatus,
    })
    controllerRef.current = controller
    void controller.preload(preloadWords)
    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [audioRef, preloadWords])

  return { status, play: (word: WordEntry) => controllerRef.current?.play(word) }
}
```

Stabilize `preloadWords` in the caller with `useMemo` so ordinary renders do not recreate the controller.

- [ ] **Step 5: Verify and commit**

```powershell
npm run test:run -- src/features/word-study/word-audio-player.test.ts --reporter=dot
npm run lint
git add web/src/features/word-study/word-audio-player.ts web/src/features/word-study/word-audio-player.test.ts web/src/features/word-study/useWordAudioPlayer.ts
git commit -m "fix: preload and serialize word audio"
```

---

### Task 5: Integrate Goal, Fixed Batch, and Filter Confirmation

**Files:**
- Modify: `web/src/features/WordQuickStudy.test.tsx`
- Modify: `web/src/features/WordQuickStudy.tsx`
- Modify: `web/src/features/WordQuickStudy.css`
- Modify: `web/src/App.test.tsx`

**Interfaces:**
- Consumes: batch domain, dialogs, existing mastery callbacks.
- Produces: complete goal → studying → completion page flow.

- [ ] **Step 1: Replace current dynamic-list tests with failing session tests**

Keep the existing `words` and `createProps`, and add these helpers inside the `describe` block:

```tsx
let user: ReturnType<typeof userEvent.setup>

beforeEach(() => {
  user = userEvent.setup()
})

async function startWithGoal(goal: number, overrides: Partial<WordQuickStudyProps> = {}) {
  const props = createProps(overrides)
  render(<WordQuickStudy {...props} />)
  const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
  await user.clear(input)
  await user.type(input, String(goal))
  await user.click(screen.getByRole('button', { name: '开背' }))
  return props
}

function visibleWordIds() {
  return within(screen.getByRole('list', { name: '单词列表' }))
    .getAllByRole('listitem')
    .map((row) => row.getAttribute('data-word-id'))
}
```

Add independent tests for:

```tsx
it('hides the list until the learner accepts the default goal', async () => {
  render(<WordQuickStudy {...createProps()} />)
  expect(screen.getByRole('dialog', { name: '设定本次背诵目标' })).toBeVisible()
  expect(screen.queryByRole('list', { name: '单词列表' })).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '开背' }))
  expect(screen.getByRole('list', { name: '单词列表' })).toBeVisible()
})

it('does not replenish a fixed batch after mastery', async () => {
  await startWithGoal(2)
  await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
  expect(screen.queryByText('ability', { exact: true })).not.toBeInTheDocument()
  expect(screen.getByText('able', { exact: true })).toBeVisible()
  expect(screen.queryByText('book', { exact: true })).not.toBeInTheDocument()
  expect(screen.getByText('本轮目标 2 · 剩余 1')).toBeVisible()
})

it('cancels random rebuilding without changing the batch or selected rule', async () => {
  await startWithGoal(2)
  const before = visibleWordIds()
  await user.click(screen.getByRole('button', { name: '随机单词' }))
  expect(screen.getByText('将会重新按照随机单词排序给出2个单词背诵')).toBeVisible()
  await user.click(screen.getByRole('button', { name: '取消' }))
  expect(visibleWordIds()).toEqual(before)
  expect(screen.getByRole('button', { name: '顺序单词' })).toHaveAttribute('aria-pressed', 'true')
})

it('confirms a concrete letter and uses the actual available count', async () => {
  await startWithGoal(30)
  await user.click(screen.getByRole('button', { name: '按首字母' }))
  expect(screen.queryByRole('dialog', { name: '重新生成本轮单词？' })).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '字母 Z' }))
  expect(screen.getByText('当前最多可提供1个。')).toBeVisible()
  await user.click(screen.getByRole('button', { name: '确认' }))
  expect(screen.getByText('zero', { exact: true })).toBeVisible()
  expect(screen.getByText('本轮目标 1 · 剩余 1')).toBeVisible()
})

it('temporarily views mastered words then restores the exact batch', async () => {
  await startWithGoal(2)
  const before = visibleWordIds()
  await user.click(screen.getByRole('button', { name: '已掌握单词' }))
  await user.click(screen.getByRole('button', { name: '返回本轮单词' }))
  expect(visibleWordIds()).toEqual(before)
})
```

Add tests for reset-goal cancel, reset-goal start, search not importing `book`, all-mastered entry state, complete dialog, “继续背” reopening goal, and “先休息一下” calling `onBack`.

- [ ] **Step 2: Run and verify the old component fails the new contract**

```powershell
npm run test:run -- src/features/WordQuickStudy.test.tsx src/App.test.tsx --reporter=dot
```

Expected: FAIL because the list is immediately visible and mastery replenishes it.

- [ ] **Step 3: Introduce explicit session state**

Replace `limitInput`, `limit`, and dynamic `selectWords` for study mode with:

```ts
type GoalDialogContext = 'initial' | 'reset' | 'continue' | null

const [batch, setBatch] = useState<WordStudyBatch | null>(null)
const [goalDialogContext, setGoalDialogContext] = useState<GoalDialogContext>('initial')
const [pendingRule, setPendingRule] = useState<WordBatchRule | null>(null)
const [viewingMastered, setViewingMastered] = useState(false)
const [query, setQuery] = useState('')
const [hiddenDefinitionIds, setHiddenDefinitionIds] = useState<Set<string>>(() => new Set())
const [shuffleSeed, setShuffleSeed] = useState(() => Date.now())
```

Create new batches only through:

```ts
function startBatch(requestedSize: number, rule: WordBatchRule) {
  const result = createWordStudyBatch({ words, masteredWordIds, requestedSize, rule })
  batchVersionRef.current += 1
  setBatch(result.batch)
  setQuery('')
  setHiddenDefinitionIds(new Set())
  if (rule.kind === 'random') setShuffleSeed(rule.seed)
  setViewingMastered(false)
  setPendingRule(null)
  setGoalDialogContext(null)
}
```

Initial and continue contexts use `{ kind: 'ordered' }`; reset uses `batch?.rule ?? { kind: 'ordered' }`.

- [ ] **Step 4: Implement pending rule semantics**

Do not update the selected button on click. Set only `pendingRule`; derive `pendingAvailableCount` with `useMemo(getWordCandidates(...).length)` from the latest `pendingRule`, `masteredWordIds`, and `words`, so a parent mastery update while the dialog is open updates the warning. On confirm recompute once more through `createWordStudyBatch` inside `startBatch(batch.requestedSize, pendingRule)`. On cancel only set `pendingRule(null)`. When `pendingAvailableCount === 0`, render “该条件下暂无可背单词”，disable “确认”，and leave the current batch untouched.

Rules:

```ts
function requestMode(kind: 'ordered' | 'random') {
  if (!batch) return
  const rule = kind === 'random'
    ? { kind: 'random' as const, seed: shuffleSeed + 1 }
    : { kind: 'ordered' as const }
  if (!viewingMastered && sameRule(batch.rule, rule) && kind !== 'random') return
  setPendingRule(rule)
}

function requestInitial(initial: string) {
  setPendingRule({ kind: 'initial', initial })
}
```

Clicking “按首字母” only sets an instruction status such as “请选择下方具体字母”，never `pendingRule`. Clicking the currently active batch rule while in mastered view exits mastered view and restores the batch. Add an explicit “返回本轮单词” button in mastered view.

- [ ] **Step 5: Render goal, progress, mastered, and completion states**

- If `goalDialogContext` is non-null, show `WordGoalDialog`; `canCancel` is true only for `reset`.
- If `batch` exists, render progress as `本轮目标 ${batch.actualSize} · 剩余 ${batch.remainingWordIds.length}`.
- “重新设定目标” sets context `reset` without clearing batch.
- Study list comes from `selectBatchWords(batch, words, query)`.
- Mastered view comes from `getWordCandidates({ mode: 'mastered', ... })` and does not mutate batch.
- `batch.remainingWordIds.length === 0` renders `WordBatchCompleteDialog` unless a new goal dialog is already open.
- Continue sets context `continue`; rest calls `onBack`.

- [ ] **Step 6: Update App integration expectations and responsive shell**

The App test that opens the word page must first assert the goal dialog, click “开背”, then assert the list. Keep the fixed return button functional while the target dialog is visible. Update toolbar CSS for static progress and “重新设定目标”.

- [ ] **Step 7: Verify and commit**

```powershell
npm run test:run -- src/features/WordQuickStudy.test.tsx src/App.test.tsx --reporter=dot
npm run lint
git add web/src/features/WordQuickStudy.tsx web/src/features/WordQuickStudy.css web/src/features/WordQuickStudy.test.tsx web/src/App.test.tsx
git commit -m "feat: add fixed word study sessions"
```

---

### Task 6: Add Definition Hints, Mastery Fireworks, and Audio Feedback

**Files:**
- Create: `web/src/features/word-study/WordMasteryBurst.tsx`
- Create: `web/src/features/word-study/WordMasteryBurst.test.tsx`
- Modify: `web/src/features/WordQuickStudy.tsx`
- Modify: `web/src/features/WordQuickStudy.css`
- Modify: `web/src/features/WordQuickStudy.test.tsx`

**Interfaces:**
- Consumes: `useWordAudioPlayer`, fixed batch, mastery callbacks.
- Produces: visible definition-state copy, latest-only audio state, and 800ms button-local celebration.

- [ ] **Step 1: Write failing row and animation tests**

Add assertions:

```tsx
expect(screen.getByRole('button', { name: '点击可隐藏 ability 的中文释义' }))
  .toHaveTextContent('点击可隐藏中文释义')
await user.click(screen.getByRole('button', { name: '点击可隐藏 ability 的中文释义' }))
expect(screen.getByRole('button', { name: '点击可展示 ability 的中文释义' }))
  .toHaveTextContent('点击可展示中文释义')
```

Import `act` from Testing Library, then use an isolated fake-timer test so the suite always restores real timers:

```tsx
it('persists mastery immediately and removes the row after the 800ms burst', async () => {
  vi.useFakeTimers()
  try {
    const timedUser = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const props = createProps()
    render(<WordQuickStudy {...props} />)
    const input = screen.getByRole('spinbutton', { name: '本次背诵数量目标' })
    await timedUser.clear(input)
    await timedUser.type(input, '2')
    await timedUser.click(screen.getByRole('button', { name: '开背' }))
    await timedUser.click(screen.getByRole('button', { name: '已掌握 ability' }))

    expect(props.onMarkMastered).toHaveBeenCalledWith('word-0001')
    expect(screen.getByTestId('mastery-burst-word-0001')).toBeVisible()
    expect(screen.getByText('ability', { exact: true })).toBeVisible()
    await act(async () => { vi.advanceTimersByTime(800) })
    expect(screen.queryByText('ability', { exact: true })).not.toBeInTheDocument()
  } finally {
    vi.useRealTimers()
  }
})
```

Mock `matchMedia('(prefers-reduced-motion: reduce)')` true and assert no burst is rendered and removal is immediate. Add audio status tests that a clicked button shows `加载中` and a controller error displays `播放失败，请再次点击`.

- [ ] **Step 2: Run and verify missing hint/burst behavior fails**

```powershell
npm run test:run -- src/features/WordQuickStudy.test.tsx src/features/word-study/WordMasteryBurst.test.tsx --reporter=dot
```

Expected: FAIL because the hint button and burst component do not exist.

- [ ] **Step 3: Implement reduced-motion-aware burst**

`WordMasteryBurst.tsx`:

```tsx
export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export function WordMasteryBurst({ wordId }: { wordId: string }) {
  return (
    <span aria-hidden="true" className="word-mastery-burst" data-testid={`mastery-burst-${wordId}`}>
      {Array.from({ length: 10 }, (_, index) => (
        <span className={`word-mastery-particle particle-${index + 1}`} key={index} />
      ))}
    </span>
  )
}
```

CSS places the particle layer absolutely around `.word-mastered-control`, with ten direction/color variables and an 800ms effect:

```css
.word-mastered-control { position: relative; }
.word-mastery-burst { inset: 50% auto auto 50%; pointer-events: none; position: absolute; z-index: 2; }
.word-mastery-particle {
  --burst-x: 0px;
  --burst-y: -28px;
  --burst-color: #22c55e;
  animation: word-firework 800ms ease-out forwards;
  background: var(--burst-color);
  border-radius: 999px;
  height: 6px;
  left: -3px;
  position: absolute;
  top: -3px;
  width: 6px;
}
.particle-1 { --burst-x: 0px; --burst-y: -32px; --burst-color: #22c55e; }
.particle-2 { --burst-x: 20px; --burst-y: -26px; --burst-color: #f59e0b; }
.particle-3 { --burst-x: 32px; --burst-y: -8px; --burst-color: #38bdf8; }
.particle-4 { --burst-x: 28px; --burst-y: 16px; --burst-color: #a78bfa; }
.particle-5 { --burst-x: 10px; --burst-y: 30px; --burst-color: #fb7185; }
.particle-6 { --burst-x: -10px; --burst-y: 30px; --burst-color: #22c55e; }
.particle-7 { --burst-x: -28px; --burst-y: 16px; --burst-color: #f59e0b; }
.particle-8 { --burst-x: -32px; --burst-y: -8px; --burst-color: #38bdf8; }
.particle-9 { --burst-x: -20px; --burst-y: -26px; --burst-color: #a78bfa; }
.particle-10 { --burst-x: 0px; --burst-y: 24px; --burst-color: #fb7185; }
@keyframes word-firework {
  0% { opacity: 1; transform: translate(0, 0) scale(0.4); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--burst-x), var(--burst-y)) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .word-mastery-particle { animation: none; display: none; }
}
```

- [ ] **Step 4: Persist mastery immediately, remove after the effect**

Maintain `celebratingWordIds` and timer handles. Handler:

```ts
function markMastered(wordId: string) {
  if (celebratingWordIds.has(wordId)) return
  if (!batch?.remainingWordIds.includes(wordId)) return
  const batchVersionAtClick = batchVersionRef.current
  onMarkMastered(wordId)
  if (prefersReducedMotion()) {
    setBatch((current) => batchVersionRef.current === batchVersionAtClick && current
      ? completeWordInBatch(current, wordId)
      : current)
    return
  }
  setCelebratingWordIds((current) => new Set(current).add(wordId))
  const timer = window.setTimeout(() => {
    setCelebratingWordIds((current) => {
      const next = new Set(current)
      next.delete(wordId)
      return next
    })
    setBatch((current) => batchVersionRef.current === batchVersionAtClick && current
      ? completeWordInBatch(current, wordId)
      : current)
    masteryTimers.current.delete(wordId)
  }, 800)
  masteryTimers.current.set(wordId, timer)
}
```

Declare `const batchVersionRef = useRef(0)` with the session state. Clear every timer on unmount. The version guard prevents a stale timer from touching a replacement batch while allowing several particles in the same batch to finish independently.

- [ ] **Step 5: Split the definition prompt from the word body**

Render a separate gray button between the body and audio:

```tsx
<button
  aria-label={`${definitionVisible ? '点击可隐藏' : '点击可展示'} ${entry.word} 的中文释义`}
  className="word-definition-hint"
  onClick={() => toggleDefinition(entry.id)}
  type="button"
>
  {definitionVisible ? '点击可隐藏中文释义' : '点击可展示中文释义'}
</button>
```

Keep the body button toggling the same state. Desktop grid becomes `48px minmax(220px, 1fr) minmax(126px, auto) auto auto`. The hint is centered, gray `#64748b`, and `font-size: 0.9rem`, matching `.word-meaning`. On narrow screens it moves below the body without covering audio or mastery controls.

Use `const definitionVisible = !hiddenDefinitionIds.has(entry.id)`. `toggleDefinition` clones the set and adds a visible ID or deletes a hidden ID. Because the set represents only exceptions, every word in both the current batch and the separate mastered view starts with Chinese visible; rebuilding a batch clears the set, while merely entering/leaving mastered view does not touch it.

- [ ] **Step 6: Wire the new audio player and visible states**

Keep a hidden audio element without a React-controlled `src`:

```tsx
const audioRef = useRef<HTMLAudioElement>(null)
const preloadWords = useMemo(
  () => batch ? selectBatchWords(batch, words, '') : [],
  [batch, words],
)
const { status: audioStatus, play } = useWordAudioPlayer(audioRef, preloadWords)
```

The audio button text/icon is:

- current word + `loading`: text `加载中…`, `aria-label="正在加载 ${entry.word} 的美式发音"`
- current word + `playing`: visible playing indicator plus speaker icon, `aria-label="正在播放 ${entry.word} 的美式发音"`
- otherwise: speaker icon, `aria-label="播放 ${entry.word} 的美式发音"`

Use `aria-live="polite"` for the single error message. Clicking audio calls `play(entry)` and never toggles definition. Remove `audioPath`, direct `setAttribute`, and the old `playAudio` function.

- [ ] **Step 7: Verify and commit**

```powershell
npm run test:run -- src/features/WordQuickStudy.test.tsx src/features/word-study/WordMasteryBurst.test.tsx src/features/word-study/word-audio-player.test.ts --reporter=dot
npm run lint
npm run build
git add web/src/features/word-study/WordMasteryBurst.tsx web/src/features/word-study/WordMasteryBurst.test.tsx web/src/features/WordQuickStudy.tsx web/src/features/WordQuickStudy.css web/src/features/WordQuickStudy.test.tsx
git commit -m "feat: add responsive word feedback"
```

---

### Task 7: Verify Edge Flows and Publish v1.2.0

**Files:**
- Modify: `web/e2e/word-quick-study.spec.ts`
- Modify: `tools/public-release/package-lib.mjs`
- Modify: `tools/public-release/package-lib.test.mjs`
- Modify: `web/README.md`
- Create: `docs/release-notes/v1.2.0.md`
- Produces locally: `发布包输出/深大学位英语题库_公开版_v1.2.0.zip`

**Interfaces:**
- Consumes: retained v1.1 audio inventory, production build, Edge, 7-Zip, GitHub authentication.
- Produces: verified main and public v1.2.0 Release without changing older releases.

- [ ] **Step 1: Copy the already verified ignored MP3 inventory into this worktree**

Verify both paths resolve inside the two named project worktrees before copying:

```powershell
$audioSource = 'I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1\web\public\audio\words'
$audioTarget = 'I:\CodexProjects\学位英语攻关\.worktrees\word-session-v1.2\web\public\audio\words'
$sourceFiles = @(Get-ChildItem -LiteralPath $audioSource -Filter '*.mp3' -File)
if ($sourceFiles.Count -ne 1911) { throw "源音频数量不是 1911" }
Copy-Item -Path (Join-Path $audioSource '*.mp3') -Destination $audioTarget
node tools/audio/verify-word-audio.mjs
```

Expected: `expectedCount` and `verifiedCount` are both `1911`. MP3s remain ignored by Git.

- [ ] **Step 2: Update Edge tests for the target dialog and fixed batch**

Desktop flow:

```ts
await page.goto('/')
await expect(page.getByLabel('考试倒计时')).toHaveCount(0)
await page.getByRole('button', { name: '单词速记' }).click()
await expect(page.getByRole('dialog', { name: '设定本次背诵目标' })).toBeVisible()
await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
await page.getByRole('button', { name: '开背' }).click()
await expect(page.getByRole('list', { name: '单词列表' }).getByRole('listitem')).toHaveCount(2)
await page.getByRole('button', { name: '已掌握 ability' }).click()
await expect(page.getByText('able', { exact: true })).toBeVisible()
await expect(page.getByText('book', { exact: true })).toHaveCount(0)
await page.getByRole('button', { name: '已掌握 able' }).click()
await expect(page.getByText('建议劳逸结合，不要急功近利哦～')).toBeVisible()
await page.getByRole('button', { name: '继续背' }).click()
await expect(page.getByRole('dialog', { name: '设定本次背诵目标' })).toBeVisible()
```

Add this consecutive audio test:

```ts
test('快速连续点击时仅最后一个单词进入播放状态', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-edge')
  const pageErrors: string[] = []
  const audioResponses = new Map<string, number>()
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname
    if (pathname.endsWith('/audio/words/0001.mp3') || pathname.endsWith('/audio/words/0002.mp3')) {
      audioResponses.set(pathname, response.status())
    }
  })

  await page.goto('/')
  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
  await page.getByRole('button', { name: '开背' }).click()
  await expect.poll(() => audioResponses.get('/audio/words/0001.mp3')).toBe(200)
  await expect.poll(() => audioResponses.get('/audio/words/0002.mp3')).toBe(200)

  await page.getByRole('button', { name: '播放 ability 的美式发音' }).click()
  await page.getByRole('button', { name: '播放 able 的美式发音' }).click()
  await expect(page.getByRole('button', { name: '正在播放 able 的美式发音' })).toBeVisible()
  await expect(page.getByRole('button', { name: '正在播放 ability 的美式发音' })).toHaveCount(0)
  expect(pageErrors).toEqual([])
})
```

Mobile flow must verify: click “按首字母” alone shows no dialog, click `Z` shows the one-word warning, cancel retains the current list, repeat and confirm shows `zero`, both definition hint copies work, completing the one-word batch shows the completion dialog, and “先休息一下” returns to “今日学习”.

- [ ] **Step 3: Run E2E and fix only evidenced failures**

```powershell
npm run test:e2e
```

Expected: Edge desktop and mobile projects pass. If audio event timing fails, capture `loadstart/canplay/playing/error`, current source, and network response before changing code.

- [ ] **Step 4: Bump public package tests and release documentation**

Change `releaseVersion` to `1.2.0`. Update package tests to expect `深大学位英语题库_公开版_v1.2.0.zip` while retaining `-mcu=on`, no `-p`, no private license, and all audio/license gates.

Add `docs/release-notes/v1.2.0.md`:

```markdown
# 深圳大学学位英语 60 分攻关 v1.2.0

本次更新优化单词速记的学习节奏和本地语音响应，并从公开首页移除个人考试倒计时。

## 更新内容

- 每次进入单词速记先设定本轮目标，默认 30 个。
- 本轮单词固定，标记掌握后不自动递补。
- 切换顺序、随机或具体首字母前先确认，取消不会破坏当前批次。
- 已掌握单词作为独立浏览视图，不影响未完成批次。
- 增加释义显示状态提示、掌握小烟花和本轮完成后的休息/继续选择。
- 当前批次音频提前读取，快速连续点击时只播放最后选择的单词，并提供加载与失败反馈。
- 公开版首页不再显示考试时间和倒计时。

## Windows 使用方式

1. 下载并解压 `SZU-Degree-English-Public-v1.2.0.zip`。
2. 双击 `启动学位英语题库.cmd`，并保持启动窗口打开。
3. 浏览器自动打开后即可学习；1,911 个美式发音均已内置。

学习记录和已掌握单词只保存在当前浏览器；未完成的单词批次不会跨页面保存。
```

Update `web/README.md` with fixed-batch semantics and v1.2.0 package name.

- [ ] **Step 5: Run the full verification matrix**

From `web/`:

```powershell
npm run test:run -- --reporter=dot
npm run test:public-release
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

From the worktree root:

```powershell
node tools/audio/verify-word-audio.mjs
git diff --check
git status --short
```

Expected: all tests pass, content remains 780, audio verifier reports 1,911/1,911, and generated MP3s are ignored.

- [ ] **Step 6: Commit release workflow changes**

```powershell
git add web/e2e/word-quick-study.spec.ts tools/public-release/package-lib.mjs tools/public-release/package-lib.test.mjs web/README.md docs/release-notes/v1.2.0.md
git commit -m "test: verify fixed word study release"
```

- [ ] **Step 7: Build and inspect the v1.2.0 ZIP**

```powershell
node tools/public-release/generate-package.mjs
& 'C:\Program Files\7-Zip\7z.exe' t '发布包输出\深大学位英语题库_公开版_v1.2.0.zip'
```

Use Python `zipfile` to assert the UTF-8 root name, 1,911 MP3s, launcher, usage guide, attribution, Apache license, and zero `license.json`/personal authorization entries. Record SHA-256 with `Get-FileHash`.

- [ ] **Step 8: Extract and smoke-test the real package**

Extract to a unique directory under ignored `tools/audio/output/`, start only its bundled `node.exe server.mjs`, and use a fresh Edge context to verify:

- homepage has no countdown;
- target dialog gates the list;
- two local MP3 requests return `200 audio/mpeg` and reach the latest playing state;
- fixed batch does not refill;
- completion/continue/rest behavior works;
- no page errors occur.

Stop only the smoke-test server and verify its port is released.

- [ ] **Step 9: Merge, push, and publish without overwriting older releases**

After re-running tests on the merged `main`:

```powershell
git -C 'I:\CodexProjects\学位英语攻关' fetch origin main
git -C 'I:\CodexProjects\学位英语攻关' merge --ff-only codex/word-session-v1.2
git -C 'I:\CodexProjects\学位英语攻关' push origin main
Copy-Item '发布包输出\深大学位英语题库_公开版_v1.2.0.zip' '发布包输出\SZU-Degree-English-Public-v1.2.0.zip'
gh release create v1.2.0 '发布包输出\SZU-Degree-English-Public-v1.2.0.zip#深大学位英语题库_公开版_v1.2.0.zip' --repo yechun1993/English-lern --target main --title '深圳大学学位英语 60 分攻关 v1.2.0' --notes-file docs/release-notes/v1.2.0.md
```

Verify the new tag points to `main`, asset digest matches the local SHA-256, and v1.0.0/v1.1.0 assets remain unchanged. Preserve the v1.2 worktree until the user confirms the published package, because it contains the ignored reusable audio inventory.

---

## Self-Review

### Spec coverage

- Task 1 covers removal of public exam time and countdown.
- Tasks 2 and 5 cover fixed target snapshots, no replenishment, search, rule confirmation/cancel, candidate shortages, mastered-view preservation, reset, continue, and rest.
- Tasks 3 and 5 cover the initial gray 30 input, edited black value, list gate, validation, three dialogs, and exact completion copy.
- Tasks 4 and 6 cover batch preloading, synchronous fallback, latest-click isolation, visible loading/error state, stop/replay, and resource cleanup.
- Task 6 covers exact definition hint copy, placement, 800ms fireworks, immediate persistence, delayed row removal, final-dialog timing, and reduced motion.
- Task 7 covers Edge desktop/mobile, existing 1,911 MP3 reuse, packaging, real extracted-package smoke test, and v1.2.0 GitHub publication without older-release mutation.

### Placeholder scan

The plan contains no TBD, TODO, “appropriate handling”, or undefined follow-up. Every behavior has an exact owner, interface, test command, and expected result.

### Type consistency

- `WordBatchRule` is used consistently by batch creation and pending-rule UI.
- `requestedSize` preserves the learner's target across filter changes; `actualSize` drives progress and completion when candidates are fewer.
- `WordAudioStatus.wordId` matches `WordEntry.id`; the hook and row consume the same union.
- Mastery is persisted before `completeWordInBatch`, so delayed animation cannot lose data.
