# 单词速记与统一返回导航 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a public v1.1.0 study app with a dense offline word quick-study screen, pre-generated consistent US-English audio, persistent mastered-word handling, and prominent fixed back navigation on every non-dashboard screen.

**Architecture:** Convert the provided 1,911-word CSV into a typed, versioned source module plus a compact audio manifest. Keep word selection deterministic in a pure domain module, persist only mastered IDs through the existing local repository, and render the screen through a dedicated React feature. Generate MP3 files outside source control with a pinned local TTS pipeline, require the full audio inventory when building a public ZIP, and retain the audio as static Vite assets in the release package.

**Tech Stack:** React 19, TypeScript 6, Vite/PWA, Vitest, Playwright with Microsoft Edge, Node.js built-in modules, Python 3.10, Kokoro-82M, FFmpeg, 7-Zip CLI, GitHub CLI.

## Global Constraints

- Keep `main` and published GitHub Release `v1.0.0` unchanged until this verified branch fast-forwards into a new v1.1.0 release.
- Work only in `I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1` on branch `codex/word-mastery-v1`.
- Preserve the existing 780-question learning content and browser-local storage key `szu-degree-english.study-state.v1`.
- The provided word source contains exactly 1,911 unique entries; preserve its original integer sequence and text fields verbatim after UTF-8 parsing.
- Treat the three empty phonetic fields (`etc`, `jewelery`, `ought to`) as `null`; their English, Chinese, ID, audio, and mastery behavior must remain available.
- Frontend audio paths use `/audio/words/<four-digit-source-index>.mp3`; do not use `SpeechSynthesis`, external URLs, runtime TTS, API keys, or system-voice fallback.
- Generate MP3s with a fixed American-English Kokoro-82M voice (`af_heart`), 24 kHz mono, 48 kb/s CBR; package only generated MP3 assets, never the model, cache, credentials, or Python environment.
- Include Apache-2.0 license text and generation attribution in repository source and in every staged public ZIP.
- Store generated `web/public/audio/words/*.mp3` outside Git; the v1.1.0 public packager must reject an incomplete or unexpected audio inventory.
- Retain local-only state: mastered words, drafts, wrong answers, and reviews never sync between devices.
- Use accessibility-safe controls: no nested buttons, explicit labels, keyboard focus styles, and `aria-expanded` for individual definition visibility.
- Release a new unencrypted 64-bit Windows ZIP named `深大学位英语题库_公开版_v1.1.0.zip`; never overwrite `v1.0.0`.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `tools/word-content/2000.csv` | Checked-in, UTF-8 source of the 1,911-word vocabulary list supplied by the user. |
| `tools/word-content/generate-word-bank.mjs` | Validates CSV rows and generates the typed web word bank plus the audio inventory manifest. |
| `tools/word-content/generate-word-bank.test.mjs` | Node coverage for malformed, duplicate, missing, and valid CSV conversion. |
| `web/src/domain/word.ts` | `WordEntry`, source-index ID/audio helpers, and word-page filter types. |
| `web/src/domain/word-selection.ts` | Pure ordered, initial-letter, random, mastered, query, and limit selection rules. |
| `web/src/domain/word-selection.test.ts` | Deterministic coverage for selection order, limit, search, random seeds, and mastered filters. |
| `web/src/content/words/word-bank.ts` | Generated typed 1,911-entry `wordBank` array. |
| `web/src/content/words/word-bank.test.ts` | Content-level checks for count, IDs, original boundary entries, empty phonetics, and unique audio paths. |
| `web/src/data/study-repository.ts` | Adds backwards-compatible mastered-word persistence methods. |
| `web/src/data/study-repository.test.ts` | Verifies marking, unmarking, de-duplication, and legacy-state migration. |
| `web/src/components/FixedBackButton.tsx` | Reusable fixed, high-contrast back control. |
| `web/src/components/FixedBackButton.css` | Fixed position, notice clearance, focus and responsive styles. |
| `web/src/components/FixedBackButton.test.tsx` | Verifies button label and callback behavior. |
| `web/src/features/PracticeSession.tsx` | Adds an early return to the caller’s hub. |
| `web/src/features/SubjectiveSession.tsx` | Adds an early return that persists the current draft before leaving. |
| `web/src/features/TopicHub.tsx` | Replaces the inline return control with `FixedBackButton`. |
| `web/src/features/ClozeHub.tsx` | Replaces the inline return control with `FixedBackButton`. |
| `web/src/features/ReadingHub.tsx` | Replaces the inline return control with `FixedBackButton`. |
| `web/src/features/SubjectiveHub.tsx` | Replaces the inline return control with `FixedBackButton`. |
| `web/src/features/WordQuickStudy.tsx` | Dense word-learning page and its independent per-row interactions. |
| `web/src/features/WordQuickStudy.css` | Responsive desktop-table / mobile-compact-list presentation. |
| `web/src/features/WordQuickStudy.test.tsx` | Covers limit, definitions, audio source, mastery actions, and empty states. |
| `web/src/App.tsx` | Adds the `words` screen, homepage entry, repository callbacks, and hub-aware return handlers. |
| `web/src/App.css` | Adds the homepage `单词速记` entry layout. |
| `web/src/App.test.tsx` | Covers entering and leaving the word page from the dashboard. |
| `web/public/audio/words/.gitkeep` | Preserves the ignored generated-audio directory. |
| `tools/audio/generate-word-audio.py` | Generates MP3 assets locally from the pinned word/audio manifests. |
| `tools/audio/verify-word-audio.mjs` | Checks asset count, exact names, non-zero bytes, and FFmpeg decodability. |
| `tools/audio/verify-word-audio.test.mjs` | Tests missing, extra, and complete mocked inventories. |
| `tools/audio/requirements.txt` | Pins Python-side TTS and WAV-writing dependencies. |
| `tools/audio/README.md` | Reproducible Windows maintainer instructions and the fixed voice/encoding setting. |
| `tools/audio/KOKORO-82M-APACHE-2.0.txt` | Apache-2.0 license text retained for the audio generator and output. |
| `tools/audio/ATTRIBUTION.md` | Model version, voice, source, generation date, and output-attribution record. |
| `tools/public-release/server.mjs` | Adds `audio/mpeg` static serving. |
| `tools/public-release/package-lib.mjs` | Uses v1.1.0 metadata, validates the built audio inventory, and stages audio attribution. |
| `tools/public-release/package-lib.test.mjs` | Extends ZIP staging coverage for audio validation and v1.1.0 output naming. |
| `tools/public-release/public-source-boundary.test.mjs` | Ensures the public tree never exposes private authorization tooling or generated model/cache files. |
| `.gitignore` | Ignores generated MP3 files, model caches, WAV intermediates, and audio verification reports. |
| `web/package.json` | Adds exact vocabulary/audio validation scripts. |
| `web/playwright.config.ts` | Includes desktop and mobile word-study end-to-end specs. |
| `web/e2e/word-quick-study.spec.ts` | Exercises user-visible desktop and mobile word-study workflows against production output. |
| `web/README.md` | Documents the built-in word/audio behavior and public-package requirements. |
| `docs/release-notes/v1.1.0.md` | GitHub Release title/body and v1.1.0 usage notes. |

### Task 1: Establish the isolated baseline and record the approved design

**Files:**
- Create: `docs/superpowers/specs/2026-09-10-word-quick-study-and-navigation-design.md`

**Interfaces:**
- Consumes: `main` at `6ea3d9916fdf01e4b5728fdf10667e8b8c7d6ab0` and the approved requirements in the current conversation.
- Produces: clean `codex/word-mastery-v1` worktree and a committed approved design reference.

- [x] **Step 1: Create the isolated feature worktree**

Run from `I:\CodexProjects\学位英语攻关`:

```powershell
git worktree add '.worktrees/word-mastery-v1' -b 'codex/word-mastery-v1' main
```

Expected: worktree is created at `I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1` on `codex/word-mastery-v1`.

- [x] **Step 2: Install pinned front-end dependencies and prove the baseline**

Run from `I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1\web`:

```powershell
npm ci
npm run test:run
```

Expected: `web/node_modules/.bin/vitest.cmd` exists and Vitest reports `22 passed`, `67 passed`.

- [x] **Step 3: Commit the approved design**

Run:

```powershell
git add docs/superpowers/specs/2026-09-10-word-quick-study-and-navigation-design.md
git commit -m "docs: define word quick study experience"
```

Expected: one design-only commit; no product source has changed.

### Task 2: Create a typed, reproducible vocabulary source

**Files:**
- Create: `tools/word-content/2000.csv`
- Create: `tools/word-content/generate-word-bank.mjs`
- Create: `tools/word-content/generate-word-bank.test.mjs`
- Create: `web/src/domain/word.ts`
- Create: `web/src/content/words/word-bank.ts`
- Create: `web/src/content/words/word-bank.test.ts`
- Create: `tools/audio/word-audio-manifest.json`

**Interfaces:**
- Consumes: UTF-8 CSV columns `#`, `单词`, `音标`, `解释`, `笔记`.
- Produces: `WordEntry`, `wordBank: readonly WordEntry[]`, `toWordId(index)`, `getWordAudioPath(index)`, and a JSON array of exactly 1,911 audio inventory rows with `id`, `index`, `word`, and `fileName`.

- [ ] **Step 1: Write failing domain and content tests**

Create `web/src/content/words/word-bank.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { getWordAudioPath, toWordId } from '../../domain/word'
import { wordBank } from './word-bank'

describe('wordBank', () => {
  it('preserves the supplied 1,911-word source order and stable IDs', () => {
    expect(wordBank).toHaveLength(1911)
    expect(wordBank[0]).toMatchObject({ id: 'word-0001', index: 1, word: 'ability' })
    expect(wordBank.at(-1)).toMatchObject({ id: 'word-1911', index: 1911, word: 'zero' })
    expect(new Set(wordBank.map((entry) => entry.word))).toHaveSize(1911)
  })

  it('keeps known blank phonetics learnable and maps every index to a local MP3', () => {
    expect(wordBank.find((entry) => entry.word === 'ought to')).toMatchObject({ phonetic: null })
    expect(toWordId(1)).toBe('word-0001')
    expect(getWordAudioPath(1)).toBe('/audio/words/0001.mp3')
    expect(getWordAudioPath(1911)).toBe('/audio/words/1911.mp3')
    expect(new Set(wordBank.map((entry) => getWordAudioPath(entry.index)))).toHaveSize(1911)
  })
})
```

Create `tools/word-content/generate-word-bank.test.mjs` using temporary CSV files. Its valid case must assert:

```js
const result = await generateWordBank({ inputPath, outputModulePath, outputAudioManifestPath })
assert.deepEqual(result, { entryCount: 2, firstWord: 'ability', lastWord: 'able' })
assert.match(await readFile(outputModulePath, 'utf8'), /id: 'word-0001'/)
assert.deepEqual(JSON.parse(await readFile(outputAudioManifestPath, 'utf8')), [
  { id: 'word-0001', index: 1, word: 'ability', fileName: '0001.mp3' },
  { id: 'word-0002', index: 2, word: 'able', fileName: '0002.mp3' },
])
```

Add failure cases for a duplicate word, nonconsecutive source index, missing English/meaning, and a comma count other than five; each assertion must reject with the exact prefix `词表校验失败：`.

- [ ] **Step 2: Run focused tests and verify they fail**

Run:

```powershell
node --test tools/word-content/generate-word-bank.test.mjs
npm run test:run -- --run src/content/words/word-bank.test.ts
```

Expected: both fail because the generator, word domain, and generated module are absent.

- [ ] **Step 3: Implement the domain contract and strict generator**

Create `web/src/domain/word.ts`:

```ts
export interface WordEntry {
  id: string
  index: number
  word: string
  phonetic: string | null
  meaning: string
  note: string | null
}

export type WordBrowseMode = 'ordered' | 'initial' | 'random' | 'mastered'

export function toWordId(index: number): string {
  return `word-${String(index).padStart(4, '0')}`
}

export function getWordAudioPath(index: number): string {
  return `/audio/words/${String(index).padStart(4, '0')}.mp3`
}
```

Copy the supplied CSV verbatim to `tools/word-content/2000.csv`. Implement `generateWordBank({ inputPath, outputModulePath, outputAudioManifestPath })` in `tools/word-content/generate-word-bank.mjs` to:

```js
const expectedHeader = '#,单词,音标,解释,笔记'
const sourceLines = (await readFile(inputPath, 'utf8')).replace(/^\uFEFF/, '').trimEnd().split(/\r?\n/)
if (sourceLines.shift() !== expectedHeader) throw new Error('词表校验失败：CSV 表头不匹配。')
// Split each data line into exactly five ASCII-comma-delimited columns.
// Require source index === lineNumber, a unique lower-cased word, and nonempty word/meaning.
// Convert empty phonetic/note to null, preserve all nonempty text without rewriting it.
```

Write `web/src/content/words/word-bank.ts` in this generated shape:

```ts
import type { WordEntry } from '../../domain/word'

export const wordBank: readonly WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: '英:/əˈbɪləti/ 美:/əˈbɪləti/', meaning: 'n. 能力，能耐；才能', note: null },
  // remaining validated entries are generated from tools/word-content/2000.csv
]
```

Write audio-manifest rows as `{ id, index, word, fileName: '0001.mp3' }` in original source order. Add a generator executable block that accepts no arguments and writes both outputs from repository-relative paths.

- [ ] **Step 4: Generate the real source, run validation, and verify tests pass**

Run from the repository root:

```powershell
node tools/word-content/generate-word-bank.mjs
node --test tools/word-content/generate-word-bank.test.mjs
npm run test:run -- --run src/content/words/word-bank.test.ts
```

Expected: generator prints `词表生成完成：1911 个单词。`; Node generator tests pass; Vitest reports two word-bank assertions passed.

- [ ] **Step 5: Commit the vocabulary source and generator**

Run:

```powershell
git add tools/word-content/2000.csv tools/word-content/generate-word-bank.mjs tools/word-content/generate-word-bank.test.mjs web/src/domain/word.ts web/src/content/words/word-bank.ts web/src/content/words/word-bank.test.ts tools/audio/word-audio-manifest.json
git commit -m "feat: add validated word bank source"
```

Expected: source CSV, generated typed content, manifest, and tests are committed together.

### Task 3: Persist mastered-word IDs without altering existing question statistics

**Files:**
- Modify: `web/src/data/study-repository.ts`
- Modify: `web/src/data/study-repository.test.ts`

**Interfaces:**
- Consumes: existing `LocalStudyRepository(storage, storageKey?)` and the `WordEntry.id` string.
- Produces: `markWordMastered(wordId: string): void`, `unmarkWordMastered(wordId: string): void`, and `listMasteredWordIds(): string[]`.

- [ ] **Step 1: Write failing repository tests**

Append these tests to `web/src/data/study-repository.test.ts`:

```ts
it('persists a deduplicated mastered-word queue without changing question metrics', () => {
  const storage = new MemoryStorage()
  const repository = new LocalStudyRepository(storage)

  repository.markWordMastered('word-0001')
  repository.markWordMastered('word-0001')
  repository.markWordMastered('word-0002')

  expect(repository.listMasteredWordIds()).toEqual(['word-0001', 'word-0002'])
  expect(repository.getDashboard()).toMatchObject({ attemptCount: 0, correctCount: 0, dueReviewCount: 0 })
  expect(new LocalStudyRepository(storage).listMasteredWordIds()).toEqual(['word-0001', 'word-0002'])
})

it('accepts existing v1 study data that has no mastered-word field', () => {
  const storage = new MemoryStorage()
  storage.setItem('legacy', JSON.stringify({ attempts: [], drafts: {}, masteryByQuestion: {}, pending: [] }))

  const repository = new LocalStudyRepository(storage, 'legacy')
  expect(repository.listMasteredWordIds()).toEqual([])
  repository.markWordMastered('word-0003')
  repository.unmarkWordMastered('word-0003')
  expect(repository.listMasteredWordIds()).toEqual([])
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```powershell
npm run test:run -- --run src/data/study-repository.test.ts
```

Expected: TypeScript reports that the three mastered-word repository methods do not exist.

- [ ] **Step 3: Add the backward-compatible state and methods**

Update `PersistedStudyState` and empty state:

```ts
interface PersistedStudyState {
  attempts: AttemptEvent[]
  drafts: Record<string, Draft>
  masteryByQuestion: Record<string, MasteryState>
  masteredWordIds: string[]
  pending: PendingEvent[]
}

function createEmptyState(): PersistedStudyState {
  return { attempts: [], drafts: {}, masteryByQuestion: {}, masteredWordIds: [], pending: [] }
}
```

Make `read()` migrate valid old shapes after parsing:

```ts
if (!isPersistedState(parsed)) return createEmptyState()
return {
  ...parsed,
  masteredWordIds: Array.isArray(parsed.masteredWordIds)
    ? [...new Set(parsed.masteredWordIds.filter((id): id is string => typeof id === 'string'))]
    : [],
}
```

Add methods exactly:

```ts
markWordMastered(wordId: string): void {
  const state = this.read()
  if (!state.masteredWordIds.includes(wordId)) state.masteredWordIds.push(wordId)
  this.write(state)
}

unmarkWordMastered(wordId: string): void {
  const state = this.read()
  state.masteredWordIds = state.masteredWordIds.filter((id) => id !== wordId)
  this.write(state)
}

listMasteredWordIds(): string[] {
  return [...this.read().masteredWordIds]
}
```

Update `isPersistedState` to keep the old four required fields but not require `masteredWordIds`, so existing local data remains valid.

- [ ] **Step 4: Run the repository suite and verify it passes**

Run:

```powershell
npm run test:run -- --run src/data/study-repository.test.ts
```

Expected: all five repository tests pass, including both new word-mastery cases.

- [ ] **Step 5: Commit local word-mastery persistence**

Run:

```powershell
git add web/src/data/study-repository.ts web/src/data/study-repository.test.ts
git commit -m "feat: persist mastered word queue"
```

### Task 4: Standardize fixed return navigation

**Files:**
- Create: `web/src/components/FixedBackButton.tsx`
- Create: `web/src/components/FixedBackButton.css`
- Create: `web/src/components/FixedBackButton.test.tsx`
- Modify: `web/src/features/TopicHub.tsx`
- Modify: `web/src/features/ClozeHub.tsx`
- Modify: `web/src/features/ReadingHub.tsx`
- Modify: `web/src/features/SubjectiveHub.tsx`
- Modify: `web/src/features/PracticeSession.tsx`
- Modify: `web/src/features/PracticeSession.test.tsx`
- Modify: `web/src/features/SubjectiveSession.tsx`
- Modify: `web/src/features/SubjectiveSession.test.tsx`
- Modify: `web/src/features/TopicHub.css`
- Modify: `web/src/features/PracticeSession.css`
- Modify: `web/src/features/SubjectiveSession.css`

**Interfaces:**
- Consumes: a `label: string` and `onBack: () => void` supplied by every non-dashboard screen.
- Produces: a fixed `← <label>` control and immediate hub-aware returns; subjective returns save the current draft first.

- [ ] **Step 1: Write failing navigation tests**

Create `web/src/components/FixedBackButton.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FixedBackButton } from './FixedBackButton'

describe('FixedBackButton', () => {
  it('uses an explicit label and delegates the return action', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<FixedBackButton label="返回专项" onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: '返回专项' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
```

Append this case to `PracticeSession.test.tsx`:

```tsx
it('lets the learner leave an unfinished objective practice set', async () => {
  const user = userEvent.setup()
  const onBack = vi.fn()
  render(<PracticeSession title="诊断练习" questions={[question]} onBack={onBack} onComplete={vi.fn()} />)

  await user.click(screen.getByRole('button', { name: '返回专项' }))
  expect(onBack).toHaveBeenCalledOnce()
})
```

Append this case to `SubjectiveSession.test.tsx`:

```tsx
it('saves the active draft before returning from an unfinished subjective set', async () => {
  const user = userEvent.setup()
  const onBack = vi.fn()
  const onSaveDraft = vi.fn()
  render(<SubjectiveSession title="汉译英" questions={[translationQuestion]} onBack={onBack} onComplete={vi.fn()} onSaveDraft={onSaveDraft} />)

  await user.type(screen.getByRole('textbox', { name: '我的译文' }), 'My saved return draft.')
  await user.click(screen.getByRole('button', { name: '返回专项' }))
  expect(onSaveDraft).toHaveBeenCalledWith(translationQuestion, 'My saved return draft.')
  expect(onBack).toHaveBeenCalledOnce()
})
```

- [ ] **Step 2: Run focused tests and verify they fail**

Run:

```powershell
npm run test:run -- --run src/components/FixedBackButton.test.tsx src/features/PracticeSession.test.tsx src/features/SubjectiveSession.test.tsx
```

Expected: unresolved component import and missing `onBack` prop type errors.

- [ ] **Step 3: Implement the reusable control and wire every deep page**

Create `web/src/components/FixedBackButton.tsx`:

```tsx
import './FixedBackButton.css'

export interface FixedBackButtonProps {
  label: string
  onBack: () => void
}

export function FixedBackButton({ label, onBack }: FixedBackButtonProps) {
  return <button className="fixed-back-button" onClick={onBack} type="button">← {label}</button>
}
```

Create `FixedBackButton.css` with this exact visual baseline:

```css
.fixed-back-button {
  position: fixed;
  z-index: 20;
  top: 50px;
  left: 16px;
  width: auto;
  padding: 10px 14px;
  border: 1px solid #0f172a;
  border-radius: 10px;
  background: #172033;
  box-shadow: 0 8px 20px rgb(15 23 42 / 0.22);
  color: #fff;
  font-size: 0.88rem;
}
.fixed-back-button:hover { background: #0f766e; }
.fixed-back-button:focus-visible { outline: 3px solid #fbbf24; outline-offset: 3px; }
@media (max-width: 640px) {
  .fixed-back-button { top: 47px; left: 12px; padding: 9px 11px; }
}
```

Replace every `<button className="back-button" ...>` in the four hub components with `<FixedBackButton label="返回今日学习" onBack={onBack} />` and remove `.back-button` CSS declarations from `TopicHub.css`.

Extend `PracticeSessionProps` and `SubjectiveSessionProps` with `onBack: () => void`; render `<FixedBackButton label="返回专项" onBack={onBack} />` as the first child of their outer `<main>`. In `SubjectiveSession`, define `handleBack()` as:

```ts
function handleBack() {
  saveDraft()
  onBack()
}
```

Pass `handleBack` to `FixedBackButton`. Use `onBack` rather than the old `onComplete` in empty-state return actions. Add `padding-top: 86px` to desktop and `padding-top: 74px` to narrow-screen `.practice-shell`, `.subjective-shell`, and `.topic-shell` rules so the fixed button cannot overlap page headings.

- [ ] **Step 4: Run component/navigation tests and the complete unit suite**

Run:

```powershell
npm run test:run -- --run src/components/FixedBackButton.test.tsx src/features/PracticeSession.test.tsx src/features/SubjectiveSession.test.tsx
npm run test:run
```

Expected: focused return tests pass and the full suite has no regressions.

- [ ] **Step 5: Commit unified navigation**

Run:

```powershell
git add web/src/components/FixedBackButton.tsx web/src/components/FixedBackButton.css web/src/components/FixedBackButton.test.tsx web/src/features/TopicHub.tsx web/src/features/ClozeHub.tsx web/src/features/ReadingHub.tsx web/src/features/SubjectiveHub.tsx web/src/features/PracticeSession.tsx web/src/features/PracticeSession.test.tsx web/src/features/SubjectiveSession.tsx web/src/features/SubjectiveSession.test.tsx web/src/features/TopicHub.css web/src/features/PracticeSession.css web/src/features/SubjectiveSession.css
git commit -m "feat: add fixed back navigation"
```

### Task 5: Implement pure word selection before rendering the page

**Files:**
- Create: `web/src/domain/word-selection.ts`
- Create: `web/src/domain/word-selection.test.ts`

**Interfaces:**
- Consumes: `WordEntry[]`, `masteredWordIds`, `WordBrowseMode`, optional initial letter/query, `limit`, and a deterministic `shuffleSeed`.
- Produces: `selectWords(input): WordEntry[]`, `countAvailableWords(input): number`, and `shuffleWords(words, seed): WordEntry[]`.

- [ ] **Step 1: Write deterministic failing selection tests**

Create `web/src/domain/word-selection.test.ts` with this fixed fixture and expectations:

```ts
const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能干的', note: null },
  { id: 'word-0003', index: 3, word: 'book', phonetic: null, meaning: '书', note: null },
  { id: 'word-0004', index: 4, word: 'zero', phonetic: null, meaning: '零', note: null },
]

expect(selectWords({ words, masteredWordIds: ['word-0002'], mode: 'ordered', limit: 2, query: '' }))
  .toEqual([words[0], words[2]])
expect(selectWords({ words, masteredWordIds: [], mode: 'initial', initial: 'A', limit: 8, query: '' }))
  .toEqual([words[0], words[1]])
expect(selectWords({ words, masteredWordIds: ['word-0003'], mode: 'mastered', limit: 1, query: '' }))
  .toEqual([words[2]])
expect(selectWords({ words, masteredWordIds: [], mode: 'ordered', limit: 8, query: '书' }))
  .toEqual([words[2]])
expect(shuffleWords(words, 23).map((entry) => entry.id)).toEqual(shuffleWords(words, 23).map((entry) => entry.id))
expect(shuffleWords(words, 23).map((entry) => entry.id)).not.toEqual(words.map((entry) => entry.id))
```

Add one test that `limit: 0`, a noninteger limit, or `initial: '!'` throws `单词筛选参数无效。`.

- [ ] **Step 2: Run the selector test and verify it fails**

Run:

```powershell
npm run test:run -- --run src/domain/word-selection.test.ts
```

Expected: unresolved `./word-selection` import.

- [ ] **Step 3: Implement the selection pipeline**

Create `word-selection.ts` with these public types and order of operations:

```ts
export interface WordSelectionInput {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  mode: WordBrowseMode
  initial?: string
  query: string
  limit: number
  shuffleSeed?: number
}

export function selectWords(input: WordSelectionInput): WordEntry[] {
  validateInput(input)
  const mastered = new Set(input.masteredWordIds)
  let candidates = input.mode === 'mastered'
    ? input.words.filter((entry) => mastered.has(entry.id))
    : input.words.filter((entry) => !mastered.has(entry.id))
  if (input.mode === 'initial') candidates = candidates.filter((entry) => entry.word[0]?.toUpperCase() === input.initial)
  if (input.mode === 'random') candidates = shuffleWords(candidates, input.shuffleSeed ?? 0)
  const normalizedQuery = input.query.trim().toLowerCase()
  if (normalizedQuery) candidates = candidates.filter((entry) => entry.word.toLowerCase().includes(normalizedQuery) || entry.meaning.includes(normalizedQuery))
  return input.mode === 'mastered' ? candidates : candidates.slice(0, input.limit)
}
```

Implement `shuffleWords` using a Mulberry32 seed function plus Fisher–Yates on a copied array. `countAvailableWords` must call the same candidate selection logic but omit the final limit so the UI can display available results accurately.

- [ ] **Step 4: Run selector tests and typecheck**

Run:

```powershell
npm run test:run -- --run src/domain/word-selection.test.ts
npm run build
```

Expected: all selector expectations pass and TypeScript/Vite build succeeds.

- [ ] **Step 5: Commit the selection domain**

Run:

```powershell
git add web/src/domain/word-selection.ts web/src/domain/word-selection.test.ts
git commit -m "feat: add word selection rules"
```

### Task 6: Build the dense, accessible WordQuickStudy screen and app entry

**Files:**
- Create: `web/src/features/WordQuickStudy.tsx`
- Create: `web/src/features/WordQuickStudy.css`
- Create: `web/src/features/WordQuickStudy.test.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.css`
- Modify: `web/src/App.test.tsx`

**Interfaces:**
- Consumes: `wordBank`, word selection domain helpers, `FixedBackButton`, and callbacks `onBack`, `onMarkMastered`, `onUnmarkMastered`.
- Produces: `WordQuickStudy`, which handles local UI state but delegates persistence to `App`.

- [ ] **Step 1: Write failing interaction and integration tests**

Create `web/src/features/WordQuickStudy.test.tsx` using a four-word fixture and test these exact user outcomes:

```tsx
await user.clear(screen.getByLabelText('本次背诵数量'))
await user.type(screen.getByLabelText('本次背诵数量'), '2')
expect(screen.getByText('ability')).toBeInTheDocument()
expect(screen.getByText('able')).toBeInTheDocument()
expect(screen.queryByText('book')).not.toBeInTheDocument()

await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
expect(screen.queryByText('能力')).not.toBeInTheDocument()
await user.click(screen.getByRole('button', { name: '切换 ability 的释义显示' }))
expect(screen.getByText('能力')).toBeInTheDocument()

const audio = screen.getByLabelText('播放 ability 的美式发音')
await user.click(audio)
expect(screen.getByTestId('word-audio')).toHaveAttribute('src', '/audio/words/0001.mp3')

await user.click(screen.getByRole('button', { name: '已掌握 ability' }))
expect(onMarkMastered).toHaveBeenCalledWith('word-0001')
rerender(<WordQuickStudy {...props} masteredWordIds={['word-0001']} />)
expect(screen.queryByText('ability')).not.toBeInTheDocument()
```

Also assert that switching to `已掌握单词` displays all mastered rows even when the limit is `1`, `取消掌握 ability` invokes `onUnmarkMastered('word-0001')`, the `A` index filters to only A words, and the two random-button presses result in different visible order after incrementing the test seed.

Append this dashboard integration test to `web/src/App.test.tsx`:

```tsx
await user.click(screen.getByRole('button', { name: '单词速记' }))
expect(screen.getByRole('heading', { name: '单词速记' })).toBeInTheDocument()
await user.click(screen.getByRole('button', { name: '返回今日学习' }))
expect(screen.getByRole('heading', { name: '今日学习' })).toBeInTheDocument()
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```powershell
npm run test:run -- --run src/features/WordQuickStudy.test.tsx src/App.test.tsx
```

Expected: unresolved `WordQuickStudy` import and missing dashboard button.

- [ ] **Step 3: Implement WordQuickStudy with independent row controls**

Define these props:

```tsx
export interface WordQuickStudyProps {
  words: readonly WordEntry[]
  masteredWordIds: readonly string[]
  onBack: () => void
  onMarkMastered: (wordId: string) => void
  onUnmarkMastered: (wordId: string) => void
}
```

Initialize `mode` to `'ordered'`, `limitInput` to `'30'`, `initial` to `'A'`, `query` to `''`, `shuffleSeed` to `Date.now()`, and visible definitions to `new Set(words.map((entry) => entry.id))`. Parse the numeric input with:

```ts
const requestedLimit = Math.max(1, Math.min(Math.trunc(Number(limitInput) || 30), availableCount || 1))
```

Render the desktop list rows in this structure, keeping the three buttons siblings rather than nested controls:

```tsx
<li className="word-row" key={entry.id}>
  <span className="word-index">{entry.index}</span>
  <button aria-expanded={definitionVisible} aria-label={`切换 ${entry.word} 的释义显示`} className="word-learning-area" onClick={() => toggleDefinition(entry.id)} type="button">
    <strong>{entry.word}</strong>
    {entry.phonetic && <small>{entry.phonetic}</small>}
    {definitionVisible && <span>{entry.meaning}</span>}
  </button>
  <button aria-label={`播放 ${entry.word} 的美式发音`} className="word-audio-button" onClick={() => playAudio(entry)} type="button">🔊</button>
  <button aria-label={isMastered ? `取消掌握 ${entry.word}` : `已掌握 ${entry.word}`} className="word-mastered-button" onClick={() => isMastered ? onUnmarkMastered(entry.id) : onMarkMastered(entry.id)} type="button">{isMastered ? '取消掌握' : '已掌握'}</button>
</li>
```

`playAudio(entry)` must create/update one `<audio data-testid="word-audio" preload="none" src={getWordAudioPath(entry.index)} />`, call `audio.play()`, and set an inline error only on `error`/rejected playback: `音频暂不可播放`. It must never instantiate `SpeechSynthesisUtterance`.

Implement a sidebar with four mode buttons and A–Z index buttons. Set `aria-pressed` for the selected mode/letter; show letter counts; use `type="search"` input with label `搜索单词或释义`; add `重新随机` only in random mode. In mastered mode label the action `取消掌握`; otherwise label it `已掌握`. Render an explicit empty-state heading `暂无符合条件的单词` and show either `调整筛选条件后再试。` or `全部单词已标记掌握，可查看已掌握单词。`.

Create CSS with this fixed layout and mobile conversion:

```css
.word-study-shell { width: min(100% - 32px, 1180px); margin: 0 auto; padding: 86px 0 72px; }
.word-study-layout { display: grid; grid-template-columns: 196px minmax(0, 1fr); gap: 22px; }
.word-filter-sidebar { position: sticky; top: 104px; align-self: start; padding: 16px; border: 1px solid #dbe4ef; border-radius: 16px; background: #fff; }
.word-row { display: grid; grid-template-columns: 48px minmax(220px, 1fr) auto auto; gap: 12px; align-items: center; min-height: 72px; border-bottom: 1px solid #e2e8f0; }
.word-learning-area { display: grid; width: 100%; gap: 3px; padding: 12px 0; background: transparent; color: #172033; text-align: left; }
.word-mastered-button { width: auto; background: #16a34a; }
@media (max-width: 860px) { .word-study-shell { width: min(100% - 24px, 1180px); padding-top: 74px; } .word-study-layout { grid-template-columns: 1fr; } .word-filter-sidebar { position: static; display: flex; overflow-x: auto; gap: 8px; } }
@media (max-width: 560px) { .word-row { grid-template-columns: 32px minmax(0, 1fr) auto; align-items: start; padding: 10px 0; } .word-mastered-button { grid-column: 2 / -1; width: 100%; } }
```

In `App.tsx`, add `'words'` to `Screen`, import `wordBank` and `WordQuickStudy`, add `openWordQuickStudy() { setScreen('words') }`, and render the page before dashboard fallback:

```tsx
if (screen === 'words') {
  return withEditionNotice(<WordQuickStudy words={wordBank} masteredWordIds={repository.listMasteredWordIds()} onBack={() => setScreen('dashboard')} onMarkMastered={(id) => { repository.markWordMastered(id); setDashboard(repository.getDashboard()) }} onUnmarkMastered={(id) => { repository.unmarkWordMastered(id); setDashboard(repository.getDashboard()) }} />)
}
```

Use React state for the mastered IDs in `App` so a mark action rerenders without navigating: initialize `const [masteredWordIds, setMasteredWordIds] = useState(() => repository.listMasteredWordIds())`, then update both repository and state inside the two callbacks. Pass that state into `WordQuickStudy`. Add `<button className="topic-entry word-entry" onClick={openWordQuickStudy} type="button">单词速记</button>` adjacent to `专项突破`; set `.header-actions { flex-wrap: wrap; justify-content: flex-end; }` and `.word-entry { background: #2563eb; }` with a darker hover color.

- [ ] **Step 4: Run unit tests, lint, and production build**

Run:

```powershell
npm run test:run -- --run src/features/WordQuickStudy.test.tsx src/App.test.tsx
npm run test:run
npm run lint
npm run build
```

Expected: interaction suite and full test suite pass; lint reports no diagnostics; Vite emits a production `dist/`.

- [ ] **Step 5: Commit the word-study page**

Run:

```powershell
git add web/src/features/WordQuickStudy.tsx web/src/features/WordQuickStudy.css web/src/features/WordQuickStudy.test.tsx web/src/App.tsx web/src/App.css web/src/App.test.tsx
git commit -m "feat: add word quick study page"
```

### Task 7: Add reproducible local MP3 generation and public-package audio guards

**Files:**
- Create: `web/public/audio/words/.gitkeep`
- Create: `tools/audio/generate-word-audio.py`
- Create: `tools/audio/verify-word-audio.mjs`
- Create: `tools/audio/verify-word-audio.test.mjs`
- Create: `tools/audio/requirements.txt`
- Create: `tools/audio/README.md`
- Create: `tools/audio/KOKORO-82M-APACHE-2.0.txt`
- Create: `tools/audio/ATTRIBUTION.md`
- Modify: `.gitignore`
- Modify: `web/package.json`
- Modify: `tools/public-release/server.mjs`
- Modify: `tools/public-release/package-lib.mjs`
- Modify: `tools/public-release/package-lib.test.mjs`

**Interfaces:**
- Consumes: `tools/audio/word-audio-manifest.json`, local Python environment, `ffmpeg`, and generated `web/public/audio/words/*.mp3`.
- Produces: exactly 1,911 nonzero, decodable local MP3s, a `verifyWordAudio({ manifestPath, audioDirectory, run? })` result, and a v1.1.0 ZIP that contains audio plus attribution.

- [ ] **Step 1: Write failing audio-inventory and packager tests**

Create `tools/audio/verify-word-audio.test.mjs` with a two-row temporary manifest and injected `run` that records FFmpeg calls. Assert these cases:

```js
await assert.rejects(() => verifyWordAudio({ manifestPath, audioDirectory, run }), /缺少 0002\.mp3/)
await assert.rejects(() => verifyWordAudio({ manifestPath, audioDirectory, run }), /发现未登记的音频文件：9999\.mp3/)
await expectInventory({ files: ['0001.mp3', '0002.mp3'] })
assert.deepEqual(result, { expectedCount: 2, verifiedCount: 2 })
assert.equal(runCalls.filter(([command]) => command === 'ffmpeg').length, 2)
```

Update `tools/public-release/package-lib.test.mjs` so the fake build contains `audio/words/0001.mp3`, injects `verifyAudio` returning `{ expectedCount: 1911, verifiedCount: 1911 }`, and expects the staged package root to contain:

```js
['node.exe', 'server.mjs', 'site', 'third-party-licenses', '使用说明.txt', '启动学位英语题库.cmd']
```

Add a rejection assertion that an injected `verifyAudio` error prevents 7-Zip execution.

- [ ] **Step 2: Run audio/public packager tests and verify failure**

Run:

```powershell
node --test tools/audio/verify-word-audio.test.mjs
npm run test:public-release
```

Expected: audio verifier import and new package audio option are not yet implemented.

- [ ] **Step 3: Implement strict inventory, generation metadata, and static serving**

Implement `verifyWordAudio` to read the JSON manifest, require each `fileName` exactly once, compare the MP3 filenames in the directory exactly, reject zero-byte files, and invoke:

```js
await run('ffmpeg', ['-v', 'error', '-i', filePath, '-f', 'null', '-'])
```

for every expected MP3. The resolved result must be `{ expectedCount, verifiedCount }`.

Create `tools/audio/requirements.txt`:

```text
kokoro==0.9.4
soundfile==0.13.1
```

Create `generate-word-audio.py` to load `word-audio-manifest.json`, create `web/public/audio/words`, and fail if an output filename exists unless invoked with `--overwrite`. It must instantiate one fixed pipeline and encode each returned waveform through FFmpeg:

```python
pipeline = KPipeline(lang_code='a', repo_id='hexgrad/Kokoro-82M')
for entry in manifest:
    output_path = audio_dir / entry['fileName']
    generator = pipeline(entry['word'], voice='af_heart', speed=1.0)
    audio = np.concatenate([segment.audio for segment in generator])
    sf.write(wav_path, audio, 24000)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(wav_path), '-ac', '1', '-ar', '24000', '-b:a', '48k', str(output_path)], check=True)
```

The script must delete each temporary WAV only after FFmpeg exits successfully, print completed/total counts every 25 rows, and finish by invoking the Node verifier. `README.md` must require a Python virtual environment, `pip install -r tools/audio/requirements.txt`, and `ffmpeg -version` before generation. Add Apache-2.0 text to `KOKORO-82M-APACHE-2.0.txt`; `ATTRIBUTION.md` must name `hexgrad/Kokoro-82M`, Apache-2.0, `af_heart`, American English, 24 kHz mono, 48 kb/s MP3, the manifest filename, and the source commit/version used to generate the batch.

Add these ignore lines:

```gitignore
# Generated offline word audio and local TTS/model caches.
web/public/audio/words/*.mp3
tools/audio/.venv/
tools/audio/cache/
tools/audio/output/
tools/audio/*.wav
```

Keep `.gitkeep` unignored. Add these `web/package.json` scripts:

```json
"generate:word-bank": "node ../tools/word-content/generate-word-bank.mjs",
"verify:word-audio": "node ../tools/audio/verify-word-audio.mjs"
```

In `tools/public-release/server.mjs`, map `'.mp3'` to `'audio/mpeg'`. In `package-lib.mjs`, set `releaseVersion = '1.1.0'`, import `verifyWordAudio`, call it after the production build but before `stagePublicRelease`, and copy `tools/audio/KOKORO-82M-APACHE-2.0.txt` plus `tools/audio/ATTRIBUTION.md` into `third-party-licenses/` within the staged package. Extend `publicUsageGuide()` with `5. 单词速记的美式发音已内置，可离线播放。`.

- [ ] **Step 4: Generate all local MP3s and validate them**

Run from the repository root:

```powershell
py -3.10 -m venv tools/audio/.venv
tools/audio/.venv/Scripts/python.exe -m pip install -r tools/audio/requirements.txt
tools/audio/.venv/Scripts/python.exe tools/audio/generate-word-audio.py
node tools/audio/verify-word-audio.mjs
```

Expected: the generator reports `1911/1911`; the verifier reports `{ expectedCount: 1911, verifiedCount: 1911 }`; no `.wav`, model, or cache file is added to Git.

- [ ] **Step 5: Run audio/package tests and create an integration build**

Run:

```powershell
node --test tools/audio/verify-word-audio.test.mjs
npm run test:public-release
npm run build
node tools/audio/verify-word-audio.mjs
```

Expected: both Node suites pass; `web/dist/audio/words/` has exactly 1,911 MP3 files after Vite copies public assets.

- [ ] **Step 6: Commit the reproducible pipeline, not generated MP3 binaries**

Run:

```powershell
git add web/public/audio/words/.gitkeep tools/audio .gitignore web/package.json tools/public-release/server.mjs tools/public-release/package-lib.mjs tools/public-release/package-lib.test.mjs
git commit -m "feat: package offline word audio"
```

Expected: `git status --short` does not list `*.mp3`; only sources, tests, license text, and documentation are committed.

### Task 8: Verify real app behavior, create the v1.1.0 ZIP, and publish it

**Files:**
- Create: `web/e2e/word-quick-study.spec.ts`
- Modify: `web/playwright.config.ts`
- Modify: `web/README.md`
- Create: `docs/release-notes/v1.1.0.md`

**Interfaces:**
- Consumes: production `web/dist`, all generated MP3 files, public package builder, existing `origin` remote, GitHub authentication, and the v1.1.0 release notes.
- Produces: verified `main`, GitHub Release `v1.1.0`, and `深大学位英语题库_公开版_v1.1.0.zip`.

- [ ] **Step 1: Write failing production-workflow tests**

Create `web/e2e/word-quick-study.spec.ts` with this desktop flow:

```ts
test('单词速记可离线播放、标记掌握并在已掌握筛选中恢复', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByLabel('本次背诵数量').fill('2')
  await page.getByRole('button', { name: '播放 ability 的美式发音' }).click()
  await expect(page.locator('[data-testid="word-audio"]')).toHaveAttribute('src', '/audio/words/0001.mp3')
  await page.getByRole('button', { name: '已掌握 ability' }).click()
  await expect(page.getByText('ability', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '已掌握单词' }).click()
  await expect(page.getByText('ability', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '取消掌握 ability' }).click()
  await expect(page.getByText('暂无符合条件的单词')).toBeVisible()
  await page.getByRole('button', { name: '返回今日学习' }).click()
  await expect(page.getByRole('heading', { name: '今日学习' })).toBeVisible()
})
```

Add a mobile test that opens the page at a `412 × 915` viewport, switches to `首字母`, chooses `Z`, checks `zero`, toggles its definition, and asserts the fixed return button is visible and its bounding box `x` is below 24.

- [ ] **Step 2: Run the new test and verify it fails before the page is fully wired**

Run:

```powershell
npm run test:e2e -- --project=desktop-edge --grep="单词速记"
```

Expected: Playwright cannot find the `单词速记` dashboard button before Task 6 implementation.

- [ ] **Step 3: Include the spec in Edge projects and write user-facing release documentation**

In `web/playwright.config.ts`, set the desktop project to `testMatch: ['learning-flow.spec.ts', 'word-quick-study.spec.ts']` and the mobile project to `testMatch: ['mobile-writing.spec.ts', 'word-quick-study.spec.ts']`.

In `web/README.md`, add a `## 单词速记与离线发音` section stating all of the following:

```text
- 词表包含 1,911 个内置单词，默认每次展示 30 个未掌握单词。
- 支持顺序、首字母、随机和已掌握单词筛选；已掌握状态只保存在当前浏览器。
- 发音为随公开 Release ZIP 内置的统一美式 MP3，不需要联网。
- 源码维护者必须先生成并验证 1,911 个音频后才能生成公开 ZIP；音频二进制不提交到 Git。
```

Create `docs/release-notes/v1.1.0.md`:

```markdown
# 深圳大学学位英语 60 分攻关 v1.1.0

本次更新新增单词速记和内置统一美式发音，并优化了所有深层学习页面的返回体验。

## 新增

- 1,911 个单词的顺序、首字母、随机和已掌握单词浏览。
- 可自定义本次背诵数量；点击词条可隐藏或显示中文释义。
- 点击“已掌握”会从待背列表移除；可在“已掌握单词”中取消掌握。
- 全部单词配有离线美式 MP3 发音，无需网络。
- 所有题型页与练习页均提供固定在左上角的返回按钮；主观题返回时自动保存草稿。

## Windows 使用方式

1. 下载并解压 `深大学位英语题库_公开版_v1.1.0.zip`。
2. 双击 `启动学位英语题库.cmd`，并保持启动窗口打开。
3. 浏览器会自动打开题库；单词发音和学习内容均可离线使用。

学习记录、已掌握单词、错题和草稿仅保存在当前浏览器，不会在设备间同步。
```

- [ ] **Step 4: Run the complete verification matrix**

Run from `web/`:

```powershell
npm run test:run -- --reporter=dot
npm run test:public-release
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

Run from repository root:

```powershell
node tools/audio/verify-word-audio.mjs
git diff --check
git status --short
```

Expected: all automated checks pass; verifier sees 1,911 assets; only ignored MP3 binaries and no uncommitted source changes remain.

- [ ] **Step 5: Commit test and release documentation changes**

Run:

```powershell
git add web/e2e/word-quick-study.spec.ts web/playwright.config.ts web/README.md docs/release-notes/v1.1.0.md
git commit -m "test: verify word quick study release"
```

- [ ] **Step 6: Build and inspect the new public ZIP**

Run:

```powershell
node tools/public-release/generate-package.mjs
& 'C:\Program Files\7-Zip\7z.exe' t '发布包输出\深大学位英语题库_公开版_v1.1.0.zip'
& 'C:\Program Files\7-Zip\7z.exe' l '发布包输出\深大学位英语题库_公开版_v1.1.0.zip'
```

Expected: package generation prints a SHA-256; archive integrity reports `Everything is Ok`; listing contains `site/audio/words/0001.mp3` through `site/audio/words/1911.mp3`, `third-party-licenses/KOKORO-82M-APACHE-2.0.txt`, and `third-party-licenses/ATTRIBUTION.md`.

- [ ] **Step 7: Smoke-test an extracted package in Edge and publish v1.1.0**

Extract the ZIP to a unique temporary directory, launch `启动学位英语题库.cmd`, and use Edge to confirm HTTP 200, dashboard entry, local MP3 request, definition toggle, mastered filter, and fixed return action. Stop only the smoke-test server afterward.

Then run:

```powershell
git -C I:\CodexProjects\学位英语攻关 status --short
git -C I:\CodexProjects\学位英语攻关 merge --ff-only codex/word-mastery-v1
git -C I:\CodexProjects\学位英语攻关 push origin main
gh release create v1.1.0 "I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1\发布包输出\深大学位英语题库_公开版_v1.1.0.zip#深大学位英语题库_公开版_v1.1.0.zip" --repo yechun1993/English-lern --target main --title "深圳大学学位英语 60 分攻关 v1.1.0" --notes-file "I:\CodexProjects\学位英语攻关\.worktrees\word-mastery-v1\docs\release-notes\v1.1.0.md"
git -C I:\CodexProjects\学位英语攻关 ls-remote --heads origin main
gh release view v1.1.0 --repo yechun1993/English-lern
```

Expected: `main` fast-forwards without rewrite; GitHub lists the new v1.1.0 asset; v1.0.0 remains available and unchanged.

## Self-Review

### Spec coverage

- Homepage word entry and dense responsive page are implemented in Task 6.
- Fixed, high-contrast returns for hubs and sessions, including subjective draft saving, are implemented in Task 4.
- Quantity, ordered/default, initials, random re-roll, mastered-all behavior, search, definition toggle, and mark/unmark flow are implemented by Tasks 3, 5, and 6.
- Source CSV preservation, 1,911 count, blank phonetics, unique audio paths, US local MP3s, attribution, and no browser-voice fallback are implemented by Tasks 2 and 7.
- Public v1.1.0 packaging, no overwrite of v1.0.0, audio inventory validation, Edge checks, and release documentation are implemented in Task 8.

### Placeholder scan

The plan specifies all interfaces, test assertions, commands, filenames, browser behavior, audio options, and release steps. Generated word/audio binary content is intentionally produced by explicit validated tools rather than manually copied.

### Type consistency

`WordEntry.id` is generated by `toWordId(index)` and stored by the repository as a string. `WordQuickStudy` consumes `masteredWordIds`, while `App` owns persistence callbacks. Audio generation, runtime audio source, and public packaging all use the same four-digit `fileName` specified in `word-audio-manifest.json`.
