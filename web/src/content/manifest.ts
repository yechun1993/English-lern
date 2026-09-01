import diagnosticItems from './diagnostic.json'
import { validateQuestionBank } from '../domain/question'

export const diagnosticQuestions = validateQuestionBank(diagnosticItems)
export const allQuestions = diagnosticQuestions
