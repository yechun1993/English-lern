# 深圳大学学位英语原创题库内容生产 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按深圳大学官方试卷题型、样卷难度和 60 分保分策略，生产可被专项学习网站校验和加载的原创题库内容。

**Architecture:** 内容以按题型拆分的 JSON 文件保存，每一道题均通过 `QuestionSchema`，并携带可解释的专题标签。先产出 20 题诊断和基础专题，再分批补齐词汇语法、完形、阅读、翻译和写作；每批完成后运行统一验证器和人工抽样审校。

**Tech Stack:** TypeScript JSON import、Zod 内容 schema、Vitest、`npm run validate:content`，以及平台计划中定义的 `Question` 类型。

## Global Constraints

- 所有题目、文章、解析、参考译文和范文必须原创，不复制官方样卷题干、选项、阅读文章或第三方题库内容。
- 难度保持在深圳大学样卷的基础到中等范围，不引入四级/六级式生僻词、超长难句或专业英语。
- 每一道客观题必须有正确答案、中文解析、错误诱因、微专题、难度和版本号。
- 完形全部采用一篇 20 空、每空三选一的连贯文章；阅读每篇约 220-300 词、4 题四选一；作文按 20 分钟完成约 120 词训练。
- 每一批内容提交前运行 `npm run validate:content`；任何 schema 错误、重复 ID、答案不在选项中或缺少解析均阻止合并。
- 参考答案只能在学习者主动核对后显示；主观题范文前必须有独立作答区和自检清单。

---

## File Structure

| 路径 | 内容 |
| --- | --- |
| `web/src/content/diagnostic.json` | 首次诊断的 20 道带标签客观题。 |
| `web/src/content/grammar-foundation.json` | 9 个基础语法微专题、每专题 20 题。 |
| `web/src/content/grammar-advanced.json` | 9 个高频/易错语法微专题、每专题 20 题。 |
| `web/src/content/cloze.json` | 12 篇 20 空完形文章，共 240 空。 |
| `web/src/content/reading.json` | 16 篇阅读文章，共 64 题。 |
| `web/src/content/translation.json` | 80 道汉译英专项句。 |
| `web/src/content/writing.json` | 16 道提纲作文及参考范文。 |
| `web/src/content/manifest.ts` | 合并每个 JSON 批次，并通过 `QuestionSchema.parse` 输出 `CONTENT_BANKS`。 |
| `web/scripts/content-report.ts` | 按题型、专题、难度统计数量，确保目标数量与分布完整。 |

## Task 1: 固化内容 ID、写作风格和数量门槛

**Files:**
- Create: `web/src/content/content-plan.ts`
- Create: `web/src/content/content-plan.test.ts`
- Create: `web/scripts/content-report.ts`
- Modify: `web/src/content/manifest.ts`

**Interfaces:**
- Produces: `CONTENT_TARGETS`、`assertContentTargets(items)` 与 `npm run report:content`。
- Consumes: 平台计划 Task 2 的 `Question`、`CONTENT_BANKS` 和验证器。

- [ ] **Step 1: 写入数量与题型分布失败测试**

Create `web/src/content/content-plan.test.ts`:

```ts
import { expect, it } from 'vitest'
import { assertContentTargets } from './content-plan'

it('要求完整题库覆盖五类题型', () => {
  expect(() => assertContentTargets([])).toThrow('词汇与语法题不足')
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- --run src/content/content-plan.test.ts`  
Expected: FAIL，提示模块不存在。

- [ ] **Step 3: 定义不可变的内容目标**

Create `web/src/content/content-plan.ts`:

```ts
import type { Question } from '../domain/question'

export const CONTENT_TARGETS = {
  diagnostic: 20,
  grammar: 360,
  cloze: 240,
  reading: 64,
  translation: 80,
  writing: 16
} as const

export function assertContentTargets(items: Question[]) {
  const diagnostic = items.filter((q) => q.id.startsWith('diagnostic-'))
  const counts = {
    grammar: items.filter((q) => q.id.startsWith('grammar-')).length,
    cloze: items.filter((q) => q.type === 'cloze').length,
    reading: items.filter((q) => q.type === 'reading').length,
    translation: items.filter((q) => q.type === 'translation').length,
    writing: items.filter((q) => q.type === 'writing').length
  }
  if (diagnostic.length !== CONTENT_TARGETS.diagnostic) throw new Error('诊断题数量不正确')
  if (counts.grammar < CONTENT_TARGETS.grammar) throw new Error('词汇与语法题不足')
  if (counts.cloze < CONTENT_TARGETS.cloze) throw new Error('完形题不足')
  if (counts.reading < CONTENT_TARGETS.reading) throw new Error('阅读题不足')
  if (counts.translation < CONTENT_TARGETS.translation) throw new Error('汉译英题不足')
  if (counts.writing < CONTENT_TARGETS.writing) throw new Error('写作题不足')
}
```

Use IDs in the form `grammar-001` through `grammar-360`, `cloze-001` through `cloze-240`, `reading-001` through `reading-064`, `translation-001` through `translation-080`, and `writing-001` through `writing-016`. Add `report:content` script to `package.json` that prints per-type/per-topic/per-difficulty counts.

- [ ] **Step 4: 运行测试和空库报告**

Run:

```powershell
npm run test -- --run src/content/content-plan.test.ts
npm run report:content
```

Expected: 单元测试通过；报告明确列出每类题当前数量。

- [ ] **Step 5: 提交内容目标**

```powershell
Set-Location ..
git add web/src/content web/scripts web/package.json
git commit -m "chore: define exam question bank targets"
```

## Task 2: 生产首次诊断与 180 道基础语法题

**Files:**
- Create: `web/src/content/diagnostic.json`
- Create: `web/src/content/grammar-foundation.json`
- Modify: `web/src/content/manifest.ts`

**Interfaces:**
- Produces: 20 题诊断；9 个微专题、每专题 20 题的基础语法内容。
- Consumes: `QuestionSchema` 和 `CONTENT_BANKS`。

- [ ] **Step 1: 编写诊断覆盖断言**

Extend `content-plan.test.ts` to assert the diagnostic has exactly 20 items and covers the topic labels `时态`, `主谓一致`, `介词搭配`, `冠词`, `反意疑问句`, `非谓语`, `从句`, `虚拟语气`, `倒装`, `词义辨析`.

- [ ] **Step 2: 创建诊断题**

Write 20 original single-choice items. 每题四个选项，难度 `foundation`，只测一个知识点。诊断不得重复官方样卷的原句；每题解析必须指出正确规则与常见误选原因。

- [ ] **Step 3: 创建九个基础专题**

For each topic below, write exactly 20 original four-choice items and 20 concise Chinese explanations:

1. 名词、代词与可数/不可数；
2. 主谓一致与数量表达；
3. 一般时、进行时、完成时；
4. 被动语态；
5. 冠词、连词与基础介词；
6. 形容词、副词及比较级；
7. 常用动词搭配；
8. 日常交际与固定表达；
9. 词义辨析与词性判断。

Use IDs `grammar-001` to `grammar-180`. 每个专题应包含至少 6 个“看似相近但一项明显不符合搭配/语法”的干扰项题。

- [ ] **Step 4: 校验、随机审校与提交**

Run:

```powershell
npm run validate:content
npm run report:content
```

Manually read every tenth item (`grammar-010` through `grammar-180`) and all 20 diagnostic items for grammar, answer correctness, Chinese explanation and originality. Commit:

```powershell
Set-Location ..
git add web/src/content/diagnostic.json web/src/content/grammar-foundation.json web/src/content/manifest.ts
git commit -m "content: add diagnostic and foundation grammar bank"
```

## Task 3: 生产 180 道高频易错语法与搭配题

**Files:**
- Create: `web/src/content/grammar-advanced.json`
- Modify: `web/src/content/manifest.ts`

**Interfaces:**
- Produces: 9 个高频易错专题、每专题 20 题；累计单选题 360 道。
- Consumes: Task 2 的题目格式和 ID 规则。

- [ ] **Step 1: 创建九个高频易错专题**

Write exactly 20 original four-choice items for each topic below, IDs `grammar-181` to `grammar-360`:

1. 不定式、动名词和分词；
2. 非谓语作定语、状语与宾补；
3. 宾语从句、定语从句和状语从句；
4. 条件句与虚拟语气；
5. 强调句、倒装句与省略；
6. 反意疑问句和祈使句附加问句；
7. 高频介词与形容词搭配；
8. 高频动词短语与名词搭配；
9. 指代、替代与逻辑连接。

Use `foundation` for the first 8 items in each topic, `standard` for the next 10, `challenge` for the final 2. “challenge” 仍必须保持学位英语样卷范围，不能用偏门语法。

- [ ] **Step 2: 扩展专题覆盖测试**

Add a test asserting 18 unique grammar topic labels and exactly 360 `single-choice` items. Run: `npm run test -- --run src/content/content-plan.test.ts`.  
Expected: PASS only after all 180 items are loaded.

- [ ] **Step 3: 内容质检与提交**

Run:

```powershell
npm run validate:content
npm run report:content
```

Manually check 36 items: every `grammar-010` interval plus all 18 `challenge` items. Confirm each distractor is grammatically plausible enough to teach a contrast. Commit:

```powershell
Set-Location ..
git add web/src/content/grammar-advanced.json web/src/content/manifest.ts web/src/content/content-plan.test.ts
git commit -m "content: add high-frequency grammar and collocation bank"
```

## Task 4: 生产 12 篇完形填空与 240 道完形空题

**Files:**
- Create: `web/src/content/cloze.json`
- Modify: `web/src/content/manifest.ts`

**Interfaces:**
- Produces: 12 篇 220-300 词文章，每篇 20 空、每空三选一，共 240 个 `cloze` 项。
- Consumes: 题库 validator 和“每空一个题目”的 UI 数据格式。

- [ ] **Step 1: 建立文章和空题映射**

Create 12 original passages, themes in this exact rotation: 家庭沟通、校园学习、健康习惯、志愿服务、工作选择、网络使用、环境保护、城市生活、时间管理、旅行体验、科学常识、成长故事。每篇包含 20 个顺序编号的空；每个题目都填写 `passageId` 和 `blankIndex` 字段，不把这些结构字段拼入题干。

- [ ] **Step 2: 编写 240 个三选一空题**

For every passage create 20 `cloze` questions with exactly three options and one answer. Across each passage include at least: 6 fixed collocations, 4 preposition/connector choices, 4 word-form/part-of-speech choices, 3 contextual-meaning choices, and 3 grammar/logic choices. The explanation cites the local phrase or sentence relationship, not a generic dictionary definition.

- [ ] **Step 3: 写入结构测试**

Add a test that groups `cloze` items by `passageId`, asserts 12 groups, 20 questions per group, three options per question and 20 unique blank indexes in every group.

- [ ] **Step 4: 校验、通读与提交**

Run `npm run validate:content` and `npm run report:content`. Read all 12 restored passages from start to finish after applying answers; each must be coherent and natural. Commit:

```powershell
Set-Location ..
git add web/src/content/cloze.json web/src/content/manifest.ts web/src/content/content-plan.test.ts
git commit -m "content: add exam-style cloze practice"
```

## Task 5: 生产阅读、汉译英和写作内容

**Files:**
- Create: `web/src/content/reading.json`
- Create: `web/src/content/translation.json`
- Create: `web/src/content/writing.json`
- Modify: `web/src/content/manifest.ts`

**Interfaces:**
- Produces: 16 篇阅读/64 题、80 句汉译英、16 题提纲作文与范文。
- Consumes: 官方题型、`QuestionSchema`、主观题界面。

- [ ] **Step 1: 编写阅读文章和题目**

Write 16 original English passages, 220-300 words each: 8 narrative passages and 8 explanatory/argumentative passages. Cover economy, society, education, management, science popularization, history, daily life and environment; every passage has exactly four four-choice questions, respectively testing direct detail, contextual word/phrase meaning, inference, and main idea/author attitude. Each of the four records must share a `passageId` in the form `reading-passage-01` through `reading-passage-16`. Use IDs `reading-001` to `reading-064`.

- [ ] **Step 2: 编写汉译英专项句**

Write 80 Chinese sentences, 10 each for: basic sentence order, tense, passive/ongoing passive, non-finite structures, clauses, comparison, common collocations, and change/cause-result expressions. Every item contains one natural reference translation and a 3-5 item Chinese self-checklist. Use IDs `translation-001` to `translation-080`.

- [ ] **Step 3: 编写提纲作文**

Write 16 general-topic prompts with three Chinese outline points, including internet use, study habits, health, volunteering, reading, travel, environmental protection, lifelong learning, work-life balance, exercise, friendship, city change, online information, part-time work, technology and community service. Each `writing` item includes a 120-150 word original English model essay, a reusable three-paragraph outline, and checklist entries for word count, topic sentence, connectors, grammar review and conclusion. Use IDs `writing-001` to `writing-016`.

- [ ] **Step 4: 写入体裁和数量测试**

Add tests that assert: 16 reading passage groups of four questions; exactly 80 translations; exactly 16 writings; all writing reference answers contain 120-150 whitespace-delimited English words.

- [ ] **Step 5: 运行校验、阅读抽检与提交**

Run:

```powershell
npm run validate:content
npm run report:content
npm run test:run
```

Read all 16 passage titles and question sets; fully audit four passages selected by IDs `reading-001`, `reading-017`, `reading-033`, `reading-049`, plus all 16 writing prompts and essays. Commit:

```powershell
Set-Location ..
git add web/src/content/reading.json web/src/content/translation.json web/src/content/writing.json web/src/content/manifest.ts web/src/content/content-plan.test.ts
git commit -m "content: add reading translation and writing practice"
```

## Task 6: 执行全库审校、发布前内容验收和备份

**Files:**
- Create: `web/docs/content-audit.md`
- Create: `web/scripts/export-content.ts`
- Modify: `web/README.md`

**Interfaces:**
- Produces: 可复现的内容数量报告、审校记录和 JSON 内容备份。
- Consumes: 所有内容 JSON、`validateQuestionBank` 和 `CONTENT_TARGETS`。

- [ ] **Step 1: 编写导出脚本失败测试**

Create a Vitest test that calls exported `serializeContentBank(CONTENT_BANKS)` and asserts JSON parses back to the same number of questions and contains no `undefined` values.

- [ ] **Step 2: 实现内容导出**

Create `web/scripts/export-content.ts`:

```ts
import { writeFileSync } from 'node:fs'
import { CONTENT_BANKS } from '../src/content/manifest'

export const serializeContentBank = (items = CONTENT_BANKS) => JSON.stringify(items, null, 2)
writeFileSync('content-backup.json', serializeContentBank())
console.log(`已导出 ${CONTENT_BANKS.length} 题`)
```

Add `export:content` script to `package.json` and ignore `content-backup.json` in `.gitignore`.

- [ ] **Step 3: 完成审校清单**

Create `web/docs/content-audit.md` with a checked entry for every file, recording: schema pass, quantity pass, sampled IDs, answer verification, explanation clarity, sample-style difficulty check, originality check and reviewer/date. Do not mark any entry checked before the corresponding file has been read.

- [ ] **Step 4: 运行最终验证与备份**

Run:

```powershell
npm run validate:content
npm run report:content
npm run test:run
npm run export:content
```

Expected: content report has at least 360 single-choice, 240 cloze, 64 reading, 80 translation and 16 writing items; backup file parses as JSON; every audit row is evidence-backed.

- [ ] **Step 5: 提交题库内容**

```powershell
Set-Location ..
git add web/src/content web/scripts web/docs/content-audit.md web/package.json web/.gitignore web/README.md
git commit -m "content: complete exam-aligned study bank"
```

## Plan Self-Review

- **Spec coverage:** Tasks 2-3 cover the official grammar/word focus and diagnostic; Task 4 covers 20-blank, three-choice cloze; Task 5 covers 2-passage-style reading, translation and writing; Task 6 covers validation, audit and backup.
- **Placeholder scan:** Counts, topic lists, ID ranges, options format, audit sample IDs and commands are specified in every content task.
- **Type consistency:** Every file emits `Question` objects validated by platform Task 2; `manifest.ts` remains the only loading boundary, so UI components never consume unvalidated raw JSON.
