import type { Passage } from '../domain/passage'
import type { Question, QuestionBankValidation } from '../domain/question'
import type { TopicBank } from '../features/TopicHub'
import type { SubjectiveTopicBank } from '../features/SubjectiveHub'

export interface PassagePracticeContent {
  questionBank: QuestionBankValidation
  assignmentIssues: string[]
  passages: Passage[]
}

export interface TranslationPracticeContent {
  questionBank: QuestionBankValidation
  topicBanks: SubjectiveTopicBank[]
}

export interface WritingPracticeContent {
  questionBank: QuestionBankValidation
  questions: Question[]
}

export async function loadDiagnosticPractice() {
  const { diagnosticQuestions } = await import('./diagnostic-content')
  return diagnosticQuestions
}

export async function loadGrammarTopics(): Promise<TopicBank[]> {
  const { foundationTopicBanks } = await import('./grammar-content')
  return foundationTopicBanks
}

export async function loadClozePractice(): Promise<PassagePracticeContent> {
  const { clozeAssignmentIssues, clozePassages, clozeQuestionBank } = await import('./cloze-content')
  return {
    questionBank: clozeQuestionBank,
    assignmentIssues: clozeAssignmentIssues,
    passages: clozePassages,
  }
}

export async function loadReadingPractice(): Promise<PassagePracticeContent> {
  const { readingAssignmentIssues, readingPassages, readingQuestionBank } = await import('./reading-content')
  return {
    questionBank: readingQuestionBank,
    assignmentIssues: readingAssignmentIssues,
    passages: readingPassages,
  }
}

export async function loadTranslationPractice(): Promise<TranslationPracticeContent> {
  const { translationQuestionBank, translationTopicBanks } = await import('./translation-content')
  return { questionBank: translationQuestionBank, topicBanks: translationTopicBanks }
}

export async function loadWritingPractice(): Promise<WritingPracticeContent> {
  const { writingQuestionBank } = await import('./writing-content')
  return { questionBank: writingQuestionBank, questions: writingQuestionBank.questions }
}

export async function loadAllQuestionsForReview() {
  const { allQuestions } = await import('./manifest')
  return allQuestions
}
