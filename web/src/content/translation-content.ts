import { validateQuestionBank } from '../domain/question'
import {
  translationQuestions as translationItems,
  translationTopicBanks,
} from './translation/translation-bank'

export { translationItems, translationTopicBanks }
export const translationQuestionBank = validateQuestionBank(translationItems)
