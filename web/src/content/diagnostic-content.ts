import diagnosticItems from './diagnostic.json'
import { validateQuestionBank } from '../domain/question'

export { diagnosticItems }
export const diagnosticQuestions = validateQuestionBank(diagnosticItems)
