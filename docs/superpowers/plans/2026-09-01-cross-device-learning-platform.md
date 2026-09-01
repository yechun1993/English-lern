# 跨设备专项题库平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建可在电脑、手机和平板使用的深圳大学学位英语专项学习网站，支持专题练习、解析、错题复习、主观题草稿和跨设备同步。

**Architecture:** `web/` 是 Vite + React 的移动优先单页应用；纯函数领域层负责题目校验、掌握度和复习日期，界面通过 `StudyRepository` 接口读取本地或 Supabase 数据。首次在本地仓库完成可测试的离线体验；配置 Supabase 后，认证和学习事件以同一接口切换到云端并使用 RLS 隔离个人数据。

**Tech Stack:** Node.js 20、React 19、TypeScript strict、Vite、Tailwind CSS、Zod、Vitest、React Testing Library、Playwright、vite-plugin-pwa、Supabase Auth/Postgres。

## Global Constraints

- 题库严格贴合深圳大学样卷的五部分，首页不得把整套模拟卷作为默认入口。
- UI 和解析使用简体中文；英语仅用于题干、选项、参考表达和范文。
- 客观题必须一题一屏，学习者主动点击“核对答案”后才显示解析，且可标记“这题是猜的”。
- 主观题提供作答保存、参考答案/范文和自检清单；首版不得调用 AI 自动判分或要求用户配置 API 密钥。
- 复习状态要求在不同复习日累计正确 3 次才标记“已掌握”。
- 本地断网时不得丢失作答；云端恢复后以事件写入方式同步，不能覆盖已有作答。
- 发布前不得把密钥写入仓库；Supabase 服务角色密钥永不进入浏览器。
- 所有公开数据库表都启用 RLS；学习者只能读写自己的作答、掌握度、草稿和偏好。

---

## File Structure

| 路径 | 职责 |
| --- | --- |
| `web/src/domain/question.ts` | 题型、题目、解析、专题和内容校验的领域类型与 Zod schema。 |
| `web/src/domain/review.ts` | 根据作答记录计算掌握状态和下次复习日期的纯函数。 |
| `web/src/domain/score.ts` | 五类题型的准备度、目标分与总分估算。 |
| `web/src/repositories/StudyRepository.ts` | UI 依赖的统一数据接口与事件类型。 |
| `web/src/repositories/LocalStudyRepository.ts` | localStorage 本地持久化、待同步队列和测试实现。 |
| `web/src/repositories/SupabaseStudyRepository.ts` | 已登录用户的 Supabase 查询、插入与队列上送实现。 |
| `web/src/lib/supabase.ts` | 仅使用 URL 与 publishable key 创建浏览器客户端。 |
| `web/src/content/` | 经过校验的原创题库 JSON；内容计划单独维护。 |
| `web/src/features/auth/` | 邮箱注册、登录、退出和会话初始化。 |
| `web/src/features/learn/` | 今日学习、专题选择、单题会话、答案核对与总结。 |
| `web/src/features/review/` | 到期复习、错题聚类和掌握状态展示。 |
| `web/src/features/writing/` | 汉译英与写作草稿、参考答案和自检清单。 |
| `web/src/features/progress/` | 五模块正确率、目标分准备度和专题薄弱点。 |
| `web/src/components/` | 页面壳、移动端导航、题目卡、同步状态和可复用 UI。 |
| `web/src/test/` | Vitest 初始化与测试工具。 |
| `web/e2e/` | Playwright 的桌面与手机端端到端测试。 |
| `web/supabase/migrations/` | 用户学习数据表、RLS 策略和索引。 |
| `web/README.md` | 本地运行、内容校验、测试、环境变量和发布前操作。 |

## Task 1: 初始化可测试的 Web 项目

**Files:**
- Create: `web/package.json`
- Create: `web/src/main.tsx`
- Create: `web/src/App.tsx`
- Create: `web/src/App.test.tsx`
- Create: `web/src/test/setup.ts`
- Create: `web/vite.config.ts`
- Create: `web/playwright.config.ts`
- Create: `web/.env.example`
- Create: `web/.gitignore`

**Interfaces:**
- Produces: `npm run dev`、`npm run test`、`npm run test:e2e`、`npm run build` 和 `npm run validate:content` 命令。

- [ ] **Step 1: 建立 Git 仓库并生成 React TypeScript 骨架**

Run:

```powershell
git init
npm create vite@latest web -- --template react-ts
Set-Location web
npm install
npm install zod @supabase/supabase-js tailwindcss @tailwindcss/vite
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test vite-plugin-pwa tsx
```

Expected: `web/package.json` 存在，且依赖安装完成。

- [ ] **Step 2: 写入会失败的首页测试**

Create `web/src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

it('显示今日学习入口', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: '今日学习' })).toBeInTheDocument()
})
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npm run test -- --run src/App.test.tsx`  
Expected: FAIL，提示找不到“今日学习”标题或测试环境尚未配置。

- [ ] **Step 4: 实现最小应用壳、Tailwind、测试设置和脚本**

Replace `web/src/App.tsx` with:

```tsx
export default function App() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-6 text-slate-900">
      <h1 className="text-3xl font-bold">今日学习</h1>
      <p className="mt-2 text-slate-600">先完成一个小专题，再复习到期错题。</p>
    </main>
  )
}
```

Create `web/src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Replace `web/vite.config.ts` with:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true }
})
```

Replace `web/src/index.css` with:

```css
@import "tailwindcss";
```

Ensure `web/src/main.tsx` imports `./index.css` before rendering `<App />`.

Add these scripts to `web/package.json`:

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:e2e": "playwright test",
  "validate:content": "tsx scripts/validate-content.ts"
}
```

Add `VITE_SUPABASE_URL=` and `VITE_SUPABASE_PUBLISHABLE_KEY=` to `web/.env.example`; add `.env.local`, `playwright-report/`, `test-results/` and `dist/` to `web/.gitignore`.

- [ ] **Step 5: 运行单元测试与生产构建**

Run:

```powershell
npm run test:run
npm run build
```

Expected: 测试通过，`dist/` 生成且无 TypeScript 错误。

- [ ] **Step 6: 提交基础工程**

```powershell
Set-Location ..
git add web
git commit -m "feat: scaffold degree english learning app"
```

## Task 2: 定义题库领域模型与内容校验器

**Files:**
- Create: `web/src/domain/question.ts`
- Create: `web/src/domain/question.test.ts`
- Create: `web/scripts/validate-content.ts`
- Create: `web/src/content/manifest.ts`
- Create: `web/src/content/diagnostic.json`

**Interfaces:**
- Produces: `QuestionSchema.parse(input): Question`、`validateQuestionBank(items): ValidationIssue[]`、`CONTENT_BANKS`。
- Consumes: Task 1 的 Vitest 与 `validate:content` 脚本。

- [ ] **Step 1: 写入内容校验失败测试**

Create `web/src/domain/question.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { QuestionSchema, validateQuestionBank } from './question'

describe('QuestionSchema', () => {
  it('拒绝缺少解析的客观题', () => {
    expect(() => QuestionSchema.parse({
      id: 'grammar-001', type: 'single-choice', topic: '反意疑问句',
      difficulty: 'foundation', stem: 'He hardly has anything, ____?',
      options: [{ id: 'A', text: 'has he' }], answer: ['A']
    })).toThrow()
  })

  it('报告重复题目 ID', () => {
    const item = QuestionSchema.parse({
      id: 'grammar-001', type: 'single-choice', topic: '反意疑问句',
      difficulty: 'foundation', stem: 'Test?', options: [{ id: 'A', text: 'A' }],
      answer: ['A'], explanation: '测试解析', misconception: '测试错误原因', version: 1
    })
    expect(validateQuestionBank([item, item])).toContain('重复题目 ID：grammar-001')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/domain/question.test.ts`  
Expected: FAIL，提示模块不存在。

- [ ] **Step 3: 实现严格题目 schema**

Create `web/src/domain/question.ts`:

```ts
import { z } from 'zod'

export const QuestionSchema = z.object({
  id: z.string().regex(/^[a-z-]+-\d{3}$/),
  type: z.enum(['single-choice', 'cloze', 'reading', 'translation', 'writing']),
  topic: z.string().min(2),
  difficulty: z.enum(['foundation', 'standard', 'challenge']),
  stem: z.string().min(1),
  options: z.array(z.object({ id: z.string(), text: z.string().min(1) })).default([]),
  answer: z.array(z.string()).min(1),
  explanation: z.string().min(1),
  misconception: z.string().min(1),
  version: z.number().int().positive(),
  passageId: z.string().min(1).optional(),
  blankIndex: z.number().int().min(1).max(20).optional(),
  referenceAnswer: z.string().optional(),
  checklist: z.array(z.string()).optional()
}).superRefine((value, ctx) => {
  if (['single-choice', 'cloze', 'reading'].includes(value.type) && value.options.length < 2) {
    ctx.addIssue({ code: 'custom', message: '客观题至少需要两个选项' })
  }
  if (value.type === 'writing' && !value.referenceAnswer) {
    ctx.addIssue({ code: 'custom', message: '写作题需要范文' })
  }
  if (['cloze', 'reading'].includes(value.type) && !value.passageId) {
    ctx.addIssue({ code: 'custom', message: '篇章题需要 passageId' })
  }
  if (value.type === 'cloze' && !value.blankIndex) {
    ctx.addIssue({ code: 'custom', message: '完形题需要 blankIndex' })
  }
})

export type Question = z.infer<typeof QuestionSchema>

export function validateQuestionBank(items: Question[]): string[] {
  const ids = new Set<string>()
  const issues: string[] = []
  for (const item of items) {
    if (ids.has(item.id)) issues.push(`重复题目 ID：${item.id}`)
    ids.add(item.id)
    if (item.answer.some((id) => !item.options.some((option) => option.id === id)) && item.options.length > 0) {
      issues.push(`答案不在选项中：${item.id}`)
    }
  }
  return issues
}
```

- [ ] **Step 4: 写入题库加载器与命令行校验器**

Create `web/src/content/manifest.ts`:

```ts
import diagnostic from './diagnostic.json'
import { QuestionSchema, type Question } from '../domain/question'

export const CONTENT_BANKS: Question[] = diagnostic.map((item) => QuestionSchema.parse(item))
```

Create `web/scripts/validate-content.ts`:

```ts
import { CONTENT_BANKS } from '../src/content/manifest'
import { validateQuestionBank } from '../src/domain/question'

const issues = validateQuestionBank(CONTENT_BANKS)
if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}
console.log(`内容校验通过：${CONTENT_BANKS.length} 题`)
```

- [ ] **Step 5: 运行校验与测试**

Run:

```powershell
npm run test:run
npm run validate:content
```

Expected: 所有 schema 测试通过；命令输出题目数量且退出码为 0。

- [ ] **Step 6: 提交领域模型**

```powershell
Set-Location ..
git add web/src/domain web/src/content web/scripts web/package.json
git commit -m "feat: add validated question content model"
```

## Task 3: 实现掌握度、间隔复习和准备度计算

**Files:**
- Create: `web/src/domain/review.ts`
- Create: `web/src/domain/review.test.ts`
- Create: `web/src/domain/score.ts`
- Create: `web/src/domain/score.test.ts`

**Interfaces:**
- Produces: `recordAttempt(state, attempt): MasteryState`、`dueOn(state): string | null`、`calculateReadiness(attempts): Readiness`。
- Consumes: `Question['topic']` 与学习者作答事件。

- [ ] **Step 1: 写入连续三次、不同日期正确才掌握的失败测试**

Create `web/src/domain/review.test.ts`:

```ts
import { expect, it } from 'vitest'
import { recordAttempt } from './review'

it('第三个不同复习日的正确作答才标记已掌握', () => {
  let state = { correctReviewDays: [], status: 'learning' as const, dueAt: '2026-09-02' }
  state = recordAttempt(state, { correct: true, guessed: false, at: '2026-09-02T09:00:00Z' })
  state = recordAttempt(state, { correct: true, guessed: false, at: '2026-09-05T09:00:00Z' })
  expect(state.status).toBe('learning')
  state = recordAttempt(state, { correct: true, guessed: false, at: '2026-09-09T09:00:00Z' })
  expect(state.status).toBe('mastered')
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/domain/review.test.ts`  
Expected: FAIL，提示找不到 `recordAttempt`。

- [ ] **Step 3: 实现确定性的复习规则**

Create `web/src/domain/review.ts`:

```ts
export type MasteryStatus = 'new' | 'learning' | 'mastered'
export type MasteryState = { correctReviewDays: string[]; status: MasteryStatus; dueAt: string | null }
export type AttemptInput = { correct: boolean; guessed: boolean; at: string }

const intervals = [1, 3, 7]

export function recordAttempt(state: MasteryState, input: AttemptInput): MasteryState {
  const day = input.at.slice(0, 10)
  if (!input.correct || input.guessed) return { correctReviewDays: [], status: 'learning', dueAt: addDays(day, 1) }
  const correctReviewDays = [...new Set([...state.correctReviewDays, day])]
  if (correctReviewDays.length >= 3) return { correctReviewDays, status: 'mastered', dueAt: addDays(day, 14) }
  return { correctReviewDays, status: 'learning', dueAt: addDays(day, intervals[correctReviewDays.length]) }
}

function addDays(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}
```

- [ ] **Step 4: 写入五模块目标分计算并测试**

Create `web/src/domain/score.ts` with module targets `{ grammar: 14, cloze: 13, reading: 14, translation: 10, writing: 12 }`, and export a function returning per-module accuracy, estimated points and `readyFor63: boolean`. Create `web/src/domain/score.test.ts` asserting a learner at all targets gets total `63` and `readyFor63 === true`.

- [ ] **Step 5: 运行领域层测试**

Run: `npm run test:run`  
Expected: 所有领域层测试通过，日期计算不依赖本地时区。

- [ ] **Step 6: 提交复习与分数规则**

```powershell
Set-Location ..
git add web/src/domain
git commit -m "feat: add mastery and readiness rules"
```

## Task 4: 实现本地存储、待同步队列与仓储接口

**Files:**
- Create: `web/src/repositories/StudyRepository.ts`
- Create: `web/src/repositories/LocalStudyRepository.ts`
- Create: `web/src/repositories/LocalStudyRepository.test.ts`
- Create: `web/src/lib/ids.ts`

**Interfaces:**
- Produces: `StudyRepository`，包含 `recordAttempt`、`saveDraft`、`getDashboard`、`listDueReviews`、`listPending`、`flushPending`。
- Consumes: Task 2 的 `Question` 与 Task 3 的 `MasteryState`。

- [ ] **Step 1: 写入断网时仍保留待同步作答的失败测试**

Create `web/src/repositories/LocalStudyRepository.test.ts`:

```ts
import { expect, it } from 'vitest'
import { LocalStudyRepository } from './LocalStudyRepository'

it('把断网作答加入待同步队列', async () => {
  const repo = new LocalStudyRepository(window.localStorage)
  await repo.recordAttempt({ id: 'event-1', questionId: 'grammar-001', correct: false, guessed: false, at: '2026-09-01T10:00:00Z' })
  expect(await repo.listPending()).toHaveLength(1)
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/repositories/LocalStudyRepository.test.ts`  
Expected: FAIL，提示仓储模块不存在。

- [ ] **Step 3: 定义仓储接口与本地实现**

Create `web/src/repositories/StudyRepository.ts`:

```ts
export type AttemptEvent = { id: string; questionId: string; correct: boolean; guessed: boolean; at: string }
export type Draft = { id: string; questionId: string; body: string; updatedAt: string }
export type DueReview = { questionId: string; topic: string; correctReviewDays: number; dueAt: string }
export type Dashboard = { dueCount: number; attemptsByModule: Record<string, number> }
export interface StudyRepository {
  recordAttempt(event: AttemptEvent): Promise<void>
  saveDraft(draft: Draft): Promise<void>
  getDashboard(): Promise<Dashboard>
  listDueReviews(asOf: string): Promise<DueReview[]>
  listPending(): Promise<AttemptEvent[]>
  flushPending(): Promise<{ sent: number; remaining: number }>
}
```

Create `web/src/repositories/LocalStudyRepository.ts` so `recordAttempt()` JSON-serializes events under `degree-english:pending-events`, `saveDraft()` writes to `degree-english:drafts`, `getDashboard()` returns `{ dueCount: 0, attemptsByModule: {} }`, `listDueReviews()` returns `[]`, and `flushPending()` returns `{ sent: 0, remaining: pending.length }` until the cloud adapter exists.

- [ ] **Step 4: 运行仓储测试与刷新持久化测试**

Add a second test that constructs a new repository with the same storage and asserts the event remains in `listPending()`. Run: `npm run test:run`.  
Expected: 断网队列和草稿可跨页面刷新保存。

- [ ] **Step 5: 提交本地优先仓储**

```powershell
Set-Location ..
git add web/src/repositories web/src/lib
git commit -m "feat: persist attempts and offline sync queue"
```

## Task 5: 添加 Supabase 认证、数据库与 RLS 策略

**Files:**
- Create: `web/supabase/migrations/202609010001_learning_data.sql`
- Create: `web/src/lib/supabase.ts`
- Create: `web/src/repositories/SupabaseStudyRepository.ts`
- Create: `web/src/repositories/SupabaseStudyRepository.test.ts`
- Modify: `web/.env.example`

**Interfaces:**
- Produces: `createSupabaseRepository(client): StudyRepository` 和仅在 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_PUBLISHABLE_KEY` 都存在时创建的 `supabase` 客户端。
- Consumes: Task 4 的 `StudyRepository`、`AttemptEvent` 与 `Draft`。

- [ ] **Step 1: 写入数据库映射失败测试**

Create `web/src/repositories/SupabaseStudyRepository.test.ts` using a fake Supabase client whose `from('attempt_events').insert()` records the payload. Assert that `recordAttempt()` writes `{ id, question_id, correct, guessed, occurred_at }` and never includes another user's ID.

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/repositories/SupabaseStudyRepository.test.ts`  
Expected: FAIL，提示 Supabase 仓储模块不存在。

- [ ] **Step 3: 写入迁移与 RLS 策略**

Create `web/supabase/migrations/202609010001_learning_data.sql`:

```sql
create table public.attempt_events (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  correct boolean not null,
  guessed boolean not null default false,
  occurred_at timestamptz not null
);
create table public.drafts (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  body text not null,
  updated_at timestamptz not null,
  unique (user_id, question_id)
);
alter table public.attempt_events enable row level security;
alter table public.drafts enable row level security;
create policy "own attempt events" on public.attempt_events for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own drafts" on public.drafts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index attempt_events_user_question_time on public.attempt_events (user_id, question_id, occurred_at desc);
```

- [ ] **Step 4: 实现安全客户端与云端仓储**

Create `web/src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = url && key ? createClient(url, key) : null
```

Implement `SupabaseStudyRepository.recordAttempt()` by obtaining `client.auth.getUser()`, returning an explicit `Error('请先登录后再同步学习记录')` when there is no user, and inserting an event with the authenticated `user.id`. Implement `flushPending()` by inserting every local event, deleting only the IDs successfully accepted by Supabase, and returning the exact sent/remaining totals.

- [ ] **Step 5: 配置并验证云端项目（需要学习者账户）**

Create a Supabase project; copy the URL and publishable key into untracked `web/.env.local`; run the migration in the project SQL editor; register two test accounts. Verify account A cannot select, insert, update or delete account B's `attempt_events` or `drafts`. Never expose the service-role key in the browser.

- [ ] **Step 6: 运行测试和构建**

Run:

```powershell
npm run test:run
npm run build
```

Expected: fake-client tests pass; production build succeeds without embedding a secret key.

- [ ] **Step 7: 提交同步适配器**

```powershell
Set-Location ..
git add web/supabase web/src/lib/supabase.ts web/src/repositories/SupabaseStudyRepository.ts web/src/repositories/SupabaseStudyRepository.test.ts web/.env.example
git commit -m "feat: sync personal study records with Supabase"
```

## Task 6: 构建认证、导航和今日学习首页

**Files:**
- Create: `web/src/features/auth/AuthGate.tsx`
- Create: `web/src/features/auth/AuthGate.test.tsx`
- Create: `web/src/components/AppShell.tsx`
- Create: `web/src/components/MobileNav.tsx`
- Create: `web/src/features/learn/DailyPlan.tsx`
- Create: `web/src/features/learn/DailyPlan.test.tsx`
- Modify: `web/src/App.tsx`

**Interfaces:**
- Produces: `AuthGate`、`AppShell` 和 `DailyPlan`；未配置云端时显示本地试用说明，已配置时支持邮箱注册/登录。
- Consumes: Task 4/5 的仓储和 `CONTENT_BANKS`。

- [ ] **Step 1: 写入今日任务排序失败测试**

Create `web/src/features/learn/DailyPlan.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { DailyPlan } from './DailyPlan'

it('先显示到期复习再显示新专题', () => {
  render(<DailyPlan dueCount={3} nextTopic="反意疑问句" />)
  expect(screen.getByText('先复习 3 题')).toBeInTheDocument()
  expect(screen.getByText('新专题：反意疑问句')).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/features/learn/DailyPlan.test.tsx`  
Expected: FAIL，提示组件不存在。

- [ ] **Step 3: 实现首页、认证和响应式导航**

Implement `DailyPlan` with a first visible card for due review, then one new topic. Implement `AuthGate` with `supabase.auth.signUp({ email, password })` and `supabase.auth.signInWithPassword({ email, password })`, showing returned errors in Chinese. Implement `MobileNav` with exactly “今日学习”“专项突破”“错题复习”“我的进度”四个入口; desktop uses the same labels in a side navigation.

- [ ] **Step 4: 运行组件测试**

Run: `npm run test:run`  
Expected: 今日任务组件与认证错误状态通过测试。

- [ ] **Step 5: 提交首页与认证**

```powershell
Set-Location ..
git add web/src/features/auth web/src/features/learn web/src/components web/src/App.tsx
git commit -m "feat: add auth shell and daily learning dashboard"
```

## Task 7: 实现单题学习会话和即时解析

**Files:**
- Create: `web/src/features/learn/QuestionSession.tsx`
- Create: `web/src/features/learn/QuestionSession.test.tsx`
- Create: `web/src/features/learn/SessionSummary.tsx`
- Create: `web/src/components/SyncStatus.tsx`

**Interfaces:**
- Produces: `QuestionSession({ questions, repository, onComplete })`；`onComplete` 接收正确数、猜对数和错题数。
- Consumes: `Question`、`StudyRepository.recordAttempt` 和 `listPending`。

- [ ] **Step 1: 写入“未点击核对不得显示解析”的失败测试**

Create `web/src/features/learn/QuestionSession.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { QuestionSession } from './QuestionSession'

const fixtureQuestion = {
  id: 'grammar-001', type: 'single-choice' as const, topic: '反意疑问句',
  difficulty: 'foundation' as const, stem: 'He is ready, ____?',
  options: [{ id: 'A', text: 'is he' }, { id: 'B', text: 'isn’t he' }],
  answer: ['B'], explanation: '测试解析', misconception: '忽略肯定陈述句', version: 1
}
const fakeRepository = {
  recordAttempt: vi.fn().mockResolvedValue(undefined),
  saveDraft: vi.fn().mockResolvedValue(undefined),
  getDashboard: vi.fn().mockResolvedValue({ dueCount: 0, attemptsByModule: {} }),
  listDueReviews: vi.fn().mockResolvedValue([]),
  listPending: vi.fn().mockResolvedValue([]),
  flushPending: vi.fn().mockResolvedValue({ sent: 0, remaining: 0 })
}

it('核对答案后才显示解析并允许标记猜对', async () => {
  const user = userEvent.setup()
  render(<QuestionSession questions={[fixtureQuestion]} repository={fakeRepository} onComplete={() => {}} />)
  expect(screen.queryByText('测试解析')).not.toBeInTheDocument()
  await user.click(screen.getByRole('radio', { name: '正确选项' }))
  await user.click(screen.getByRole('button', { name: '核对答案' }))
  expect(screen.getByText('测试解析')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '这题是猜的' })).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/features/learn/QuestionSession.test.tsx`  
Expected: FAIL，提示会话组件不存在。

- [ ] **Step 3: 实现会话状态机**

Use these explicit states in `QuestionSession`: `answering`, `checked`, `completed`. In `answering`, disable “核对答案” until an option is selected and hide answer/explanation. In `checked`, render correct/wrong styles, `question.explanation`, `question.misconception`, “这题是猜的” and “下一题”. Store exactly one `AttemptEvent` on check; a guessed correct choice must send `guessed: true`.

- [ ] **Step 4: 实现总结和同步状态**

`SessionSummary` must show “正确”“猜对”“需复习”三项数字和 a “去错题复习” button. `SyncStatus` renders “已同步” when no pending events, “等待同步（N）” when pending count is positive, and a retry button that calls `repository.flushPending()`.

- [ ] **Step 5: 运行测试与手动键盘检查**

Run: `npm run test:run`  
Expected: 解析门控、猜对标记、单次记录和同步状态测试通过。手动验证 Tab、Space、Enter 可选择和核对题目。

- [ ] **Step 6: 提交学习会话**

```powershell
Set-Location ..
git add web/src/features/learn web/src/components/SyncStatus.tsx
git commit -m "feat: add single-question learning sessions"
```

## Task 8: 实现主观题、错题复习和进度看板

**Files:**
- Create: `web/src/features/writing/SubjectivePractice.tsx`
- Create: `web/src/features/writing/SubjectivePractice.test.tsx`
- Create: `web/src/features/review/ReviewQueue.tsx`
- Create: `web/src/features/review/ReviewQueue.test.tsx`
- Create: `web/src/features/progress/ProgressDashboard.tsx`
- Create: `web/src/features/progress/ProgressDashboard.test.tsx`

**Interfaces:**
- Produces: 可保存的主观题草稿、按考点分组的到期复习和五模块准备度看板。
- Consumes: Task 3 的复习/分数函数与 Task 4 已定义的 `saveDraft`、`listDueReviews`、`getDashboard` 方法。

- [ ] **Step 1: 写入主观题与掌握状态失败测试**

Create `web/src/features/writing/SubjectivePractice.test.tsx` asserting that reference answer is absent before “查看参考答案” and appears after click; type an answer, click “保存草稿”, and assert `repository.saveDraft` gets the exact body. Create `web/src/features/review/ReviewQueue.test.tsx` asserting a topic with two outstanding correct days displays “再答对 1 次即可掌握”.

- [ ] **Step 2: 运行测试确认失败**

Run:

```powershell
npm run test -- --run src/features/writing/SubjectivePractice.test.tsx
npm run test -- --run src/features/review/ReviewQueue.test.tsx
```

Expected: FAIL，提示相应组件不存在。

- [ ] **Step 3: 实现主观题与错题队列**

`SubjectivePractice` renders prompt, textarea, save state, one hidden reference-answer panel and checklist. `ReviewQueue` groups due questions by `topic`, displays effective correct-day count from `MasteryState`, and starts a `QuestionSession` only with selected due questions.

- [ ] **Step 4: 实现五模块准备度**

`ProgressDashboard` renders five module cards with completed question count, accuracy, estimated points and target points, then shows “距离 63 分目标：已准备/仍差 N 分”. A module with no attempts must say “尚无数据”，不得显示虚假的 0% 结论。

- [ ] **Step 5: 运行完整测试**

Run: `npm run test:run`  
Expected: 草稿、参考答案门控、错题掌握提示和准备度测试通过。

- [ ] **Step 6: 提交复习与进度功能**

```powershell
Set-Location ..
git add web/src/features/writing web/src/features/review web/src/features/progress web/src/repositories
git commit -m "feat: add writing practice review queue and progress"
```

## Task 9: 启用 PWA 离线体验并完成端到端验收

**Files:**
- Modify: `web/vite.config.ts`
- Create: `web/src/components/PwaUpdateNotice.tsx`
- Create: `web/e2e/learning-flow.spec.ts`
- Create: `web/e2e/mobile-navigation.spec.ts`
- Create: `web/README.md`

**Interfaces:**
- Produces: 可安装的网页应用、离线就绪提示、Chrome Desktop 与 Pixel 7 视口的端到端测试。

- [ ] **Step 1: 写入手机端学习流程失败测试**

Create `web/e2e/mobile-navigation.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test('手机端可从今日学习进入一题并看到解析', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '今日学习' }).click()
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: '核对答案' }).click()
  await expect(page.getByText('考点解析')).toBeVisible()
})
```

- [ ] **Step 2: 运行端到端测试确认失败**

Run: `npx playwright test e2e/mobile-navigation.spec.ts`  
Expected: FAIL，原因是尚未配置 PWA、开发服务器或页面元素。

- [ ] **Step 3: 配置 PWA 与离线就绪提示**

Add `VitePWA` to `web/vite.config.ts` with manifest name `深大学位英语攻关`, short name `学位英语`, display `standalone`, theme color `#0f172a`, and `registerType: 'prompt'`. Implement `PwaUpdateNotice` using `registerSW({ onOfflineReady, onNeedRefresh })`; show “已可离线使用” and a dismiss button for the first callback, and “发现新版本” plus “立即更新” for the second callback.

- [ ] **Step 4: 配置 Playwright 项目并完成验收场景**

Configure `playwright.config.ts` with a Vite `webServer`, desktop Chromium and Pixel 7 projects. Add `learning-flow.spec.ts` to cover: select answer → check → mark guess → next → summary; refresh after a draft save → draft remains; force browser offline → answer creates “等待同步（1）”.

- [ ] **Step 5: 完整质量验证**

Run:

```powershell
npm run test:run
npx playwright install chromium
npx playwright test
npm run validate:content
npm run build
```

Expected: 单元测试、桌面/手机端 E2E、内容校验和生产构建均通过。

- [ ] **Step 6: 写入运行与发布说明并提交**

Document in `web/README.md`: local setup, `.env.local` setup, Supabase migration/RLS verification, test commands, PWA install steps, backup/export procedure, and the requirement to create a user-owned hosting/Supabase account before public release. Commit:

```powershell
Set-Location ..
git add web
git commit -m "feat: ship installable cross-device learning platform"
```

## Plan Self-Review

- **Spec coverage:** Task 2 covers validated content structure; Task 3 covers spaced mastery and 63-point readiness; Tasks 6-8 cover daily study, single-topic practice, subjective answers, review and progress; Tasks 4-5 cover event persistence, authentication, cloud synchronization and RLS; Task 9 covers PWA, device compatibility and final verification.
- **Placeholder scan:** This plan contains no unowned implementation gaps. External Supabase account setup is an explicit user-owned release prerequisite with exact configuration and RLS checks in Task 5.
- **Type consistency:** `Question` is defined in Task 2, `AttemptEvent`/`StudyRepository` in Task 4, and the Supabase adapter in Task 5; all UI tasks consume these exact names.
