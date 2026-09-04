import { z } from 'zod'
import type { Question } from './question'

const PassageTypeSchema = z.enum(['cloze', 'reading'])

function countEnglishWords(body: string): number {
  return body.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g)?.length ?? 0
}

export const PassageSchema = z
  .object({
    id: z.string().regex(/^(cloze|reading)-passage-\d{2}$/, '篇章 ID 格式不正确。'),
    type: PassageTypeSchema,
    title: z.string().min(1, '篇章必须有标题。'),
    body: z.string().min(1, '篇章正文不能为空。'),
  })
  .superRefine((passage, context) => {
    if (passage.type === 'cloze' && !/\[\d{1,2}\]/.test(passage.body)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['body'],
        message: '完形文章必须包含编号空位。',
      })
    }

    if (passage.type === 'cloze' && (countEnglishWords(passage.body) < 220 || countEnglishWords(passage.body) > 300)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['body'],
        message: '完形文章应为 220 至 300 个英文词。',
      })
    }
  })

export type Passage = z.infer<typeof PassageSchema>

export interface ClozeAssignmentValidation {
  issues: string[]
}

function getBlankIndexes(body: string): Set<number> {
  return new Set(
    [...body.matchAll(/\[(\d{1,2})\]/g)]
      .map((match) => Number(match[1])),
  )
}

export function validateClozeAssignments(
  questions: Question[],
  rawPassages: unknown[],
): ClozeAssignmentValidation {
  const issues: string[] = []
  const passagesById = new Map<string, Passage>()

  for (const rawPassage of rawPassages) {
    const parsed = PassageSchema.safeParse(rawPassage)
    if (!parsed.success) {
      issues.push(`篇章格式无效：${parsed.error.issues.map((issue) => issue.message).join('；')}`)
      continue
    }

    passagesById.set(parsed.data.id, parsed.data)
  }

  for (const question of questions) {
    if (question.type !== 'cloze') {
      continue
    }

    const passage = question.passageId ? passagesById.get(question.passageId) : undefined
    if (!passage) {
      issues.push(`完形题 ${question.id} 引用的文章不存在。`)
      continue
    }

    if (!question.blankIndex || !getBlankIndexes(passage.body).has(question.blankIndex)) {
      issues.push(`完形题 ${question.id} 引用的第 ${question.blankIndex} 空不存在。`)
    }
  }

  return { issues }
}
