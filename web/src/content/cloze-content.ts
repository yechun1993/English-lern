import { validateQuestionBank } from '../domain/question'
import { validateClozeAssignments } from '../domain/passage'
import { clozePassages, clozeQuestions as clozeItems } from './cloze/cloze-bank'

export { clozeItems, clozePassages }
export const clozeQuestionBank = validateQuestionBank(clozeItems)
export const clozeAssignmentIssues = clozeQuestionBank.success
  ? validateClozeAssignments(clozeQuestionBank.questions, clozePassages).issues
  : clozeQuestionBank.issues
