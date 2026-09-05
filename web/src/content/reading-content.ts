import { validateQuestionBank } from '../domain/question'
import { validatePassageAssignments } from '../domain/passage'
import { readingPassages, readingQuestions as readingItems } from './reading/reading-bank'

export { readingItems, readingPassages }
export const readingQuestionBank = validateQuestionBank(readingItems)
export const readingAssignmentIssues = readingQuestionBank.success
  ? validatePassageAssignments(readingQuestionBank.questions, readingPassages).issues
  : readingQuestionBank.issues
