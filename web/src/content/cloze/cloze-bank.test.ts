import { describe, expect, it } from 'vitest'
import { validateClozeAssignments } from '../../domain/passage'
import { clozePassages, clozeQuestions } from './cloze-bank'

describe('完形填空练习内容', () => {
  it('keeps every blank linked to its original passage', () => {
    expect(clozePassages).toHaveLength(9)
    expect(clozeQuestions).toHaveLength(180)
    expect(clozeQuestions.every((question) => question.options.length === 3)).toBe(true)
    expect(validateClozeAssignments(clozeQuestions, clozePassages).issues).toEqual([])
  })
})
