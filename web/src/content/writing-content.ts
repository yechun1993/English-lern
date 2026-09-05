import { validateQuestionBank } from '../domain/question'
import { writingQuestions as writingItems } from './writing/writing-bank'

export { writingItems }
export const writingQuestionBank = validateQuestionBank(writingItems)
