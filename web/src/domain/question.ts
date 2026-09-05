import { z } from 'zod'

export const QuestionTypeSchema = z.enum([
  'single-choice',
  'cloze',
  'reading',
  'translation',
  'writing',
])

export const DifficultySchema = z.enum(['foundation', 'standard', 'challenge'])

const ObjectiveQuestionTypes = new Set(['single-choice', 'cloze', 'reading'])

export const QuestionSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*-\d{3}$/, '题目 ID 必须使用模块名加三位编号。'),
    type: QuestionTypeSchema,
    topic: z.string().min(1, '题目必须标注考点。'),
    difficulty: DifficultySchema,
    stem: z.string().min(1, '题干不能为空。'),
    options: z.array(z.string().min(1)).default([]),
    answer: z.string().min(1, '答案不能为空。'),
    explanation: z.string().min(1, '题目必须提供解析。'),
    misconception: z.string().min(1, '题目必须标注易错点。'),
    version: z.number().int().positive(),
    passageId: z.string().min(1).optional(),
    blankIndex: z.number().int().min(1).max(20).optional(),
    referenceAnswer: z.string().min(1).optional(),
    checklist: z.array(z.string().min(1)).optional(),
  })
  .superRefine((question, context) => {
    if (ObjectiveQuestionTypes.has(question.type) && question.options.length < 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['options'],
        message: '客观题至少需要两个选项。',
      })
    }

    if (ObjectiveQuestionTypes.has(question.type) && !question.options.includes(question.answer)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['answer'],
        message: '客观题答案必须存在于选项中。',
      })
    }

    if (question.type === 'cloze' && !question.passageId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passageId'],
        message: '完形填空题必须关联文章。',
      })
    }

    if (question.type === 'cloze' && !question.blankIndex) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['blankIndex'],
        message: '完形填空题必须标注空号。',
      })
    }

    if (question.type === 'reading' && !question.passageId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passageId'],
        message: '阅读题必须关联文章。',
      })
    }

    if ((question.type === 'translation' || question.type === 'writing') && !question.referenceAnswer) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['referenceAnswer'],
        message: '主观题必须提供范文或参考答案。',
      })
    }

    if ((question.type === 'translation' || question.type === 'writing') && (!question.checklist || question.checklist.length < 3 || question.checklist.length > 5)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['checklist'],
        message: '主观题必须提供 3 至 5 条自检清单。',
      })
    }
  })

export type Question = z.infer<typeof QuestionSchema>

export type QuestionBankValidation =
  | { success: true; questions: Question[]; issues: [] }
  | { success: false; questions: Question[]; issues: string[] }

export function validateQuestionBank(items: unknown[]): QuestionBankValidation {
  const questions: Question[] = []
  const issues: string[] = []
  const ids = new Set<string>()

  for (const [index, item] of items.entries()) {
    const parsed = QuestionSchema.safeParse(item)

    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message).join('；')
      issues.push(`第 ${index + 1} 题格式无效：${messages}`)
      continue
    }

    if (ids.has(parsed.data.id)) {
      issues.push(`题目 ID 重复：${parsed.data.id}`)
      continue
    }

    ids.add(parsed.data.id)
    questions.push(parsed.data)
  }

  if (issues.length > 0) {
    return { success: false, questions, issues }
  }

  return { success: true, questions, issues: [] }
}
