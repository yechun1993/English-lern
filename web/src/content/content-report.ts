import type { Question } from '../domain/question'

type QuestionType = Question['type']
type Difficulty = Question['difficulty']

type CountBy<Key extends string> = Record<Key, number>

export interface ContentReport {
  total: number
  byType: CountBy<QuestionType>
  byTopic: Record<string, number>
  byDifficulty: CountBy<Difficulty>
}

function createEmptyCounts<Key extends string>(keys: readonly Key[]): CountBy<Key> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as CountBy<Key>
}

function sortCounts(counts: Record<string, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(counts).sort(([left], [right]) => left.localeCompare(right, 'zh-Hans-CN')))
}

export function createContentReport(items: Question[]): ContentReport {
  const byType = createEmptyCounts<QuestionType>([
    'single-choice',
    'cloze',
    'reading',
    'translation',
    'writing',
  ])
  const byDifficulty = createEmptyCounts<Difficulty>(['foundation', 'standard', 'challenge'])
  const byTopic: Record<string, number> = {}

  for (const question of items) {
    byType[question.type] += 1
    byDifficulty[question.difficulty] += 1
    byTopic[question.topic] = (byTopic[question.topic] ?? 0) + 1
  }

  return {
    total: items.length,
    byType,
    byTopic: sortCounts(byTopic),
    byDifficulty,
  }
}

export function formatContentReport(report: ContentReport): string {
  const typeLines = Object.entries(report.byType).map(([type, count]) => `- ${type}: ${count}`)
  const difficultyLines = Object.entries(report.byDifficulty).map(([difficulty, count]) => `- ${difficulty}: ${count}`)
  const topicLines = Object.entries(report.byTopic).map(([topic, count]) => `- ${topic}: ${count}`)

  return [
    `题库总数：${report.total}`,
    '',
    '按题型：',
    ...typeLines,
    '',
    '按难度：',
    ...difficultyLines,
    '',
    '按专题：',
    ...topicLines,
  ].join('\n')
}

export function serializeContentBank(items: Question[]): string {
  return JSON.stringify(items, null, 2)
}
