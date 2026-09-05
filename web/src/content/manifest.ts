import { validateQuestionBank } from '../domain/question'
import { clozeAssignmentIssues, clozeItems, clozePassages, clozeQuestionBank } from './cloze-content'
import { diagnosticItems, diagnosticQuestions } from './diagnostic-content'
import {
  foundationTopicBanks,
  grammarAdvancedItems,
  grammarAdvancedQuestions,
  grammarFoundationItems,
  grammarFoundationQuestions,
} from './grammar-content'
import { readingAssignmentIssues, readingItems, readingPassages, readingQuestionBank } from './reading-content'
import { translationItems, translationQuestionBank, translationTopicBanks } from './translation-content'
import { writingItems, writingQuestionBank } from './writing-content'
import type { Passage } from '../domain/passage'

export {
  clozeAssignmentIssues,
  clozeQuestionBank,
  diagnosticQuestions,
  foundationTopicBanks,
  grammarAdvancedQuestions,
  grammarFoundationQuestions,
  readingAssignmentIssues,
  readingQuestionBank,
  translationQuestionBank,
  translationTopicBanks,
  writingQuestionBank,
}
export const allPassages: Passage[] = [...clozePassages, ...readingPassages]
export const allQuestions = validateQuestionBank([
  ...diagnosticItems,
  ...grammarFoundationItems,
  ...grammarAdvancedItems,
  ...clozeItems,
  ...readingItems,
  ...translationItems,
  ...writingItems,
])
