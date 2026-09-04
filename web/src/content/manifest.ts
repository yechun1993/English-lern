import diagnosticItems from './diagnostic.json'
import { validateQuestionBank } from '../domain/question'
import { adjectivesAndAdverbs } from './foundation/adjectives-and-adverbs'
import { agreementAndQuantity } from './foundation/agreement-and-quantity'
import { articlesConjunctionsPrepositions } from './foundation/articles-conjunctions-prepositions'
import { basicTenses } from './foundation/basic-tenses'
import { dailyExpressions } from './foundation/daily-expressions'
import { nounsAndPronouns } from './foundation/nouns-and-pronouns'
import { passiveVoice } from './foundation/passive-voice'
import { verbCollocations } from './foundation/verb-collocations'
import { wordMeaningAndClass } from './foundation/word-meaning-and-class'
import { clauses } from './advanced/clauses'
import { conditionals } from './advanced/conditionals'
import { emphasisInversion } from './advanced/emphasis-inversion'
import { nonfiniteForms } from './advanced/nonfinite-forms'
import { nonfiniteFunctions } from './advanced/nonfinite-functions'
import { prepositionCollocations } from './advanced/preposition-collocations'
import { questionTags } from './advanced/question-tags'
import { referenceLogic } from './advanced/reference-logic'
import { verbNounCollocations } from './advanced/verb-noun-collocations'
import { clozePassages, clozeQuestions as clozeItems } from './cloze/cloze-bank'
import { readingPassages, readingQuestions as readingItems } from './reading/reading-bank'
import { validateClozeAssignments, validatePassageAssignments, type Passage } from '../domain/passage'

export const diagnosticQuestions = validateQuestionBank(diagnosticItems)
const grammarFoundationItems = [
  ...nounsAndPronouns,
  ...agreementAndQuantity,
  ...basicTenses,
  ...passiveVoice,
  ...articlesConjunctionsPrepositions,
  ...adjectivesAndAdverbs,
  ...verbCollocations,
  ...dailyExpressions,
  ...wordMeaningAndClass,
]

const grammarAdvancedItems = [
  ...nonfiniteForms,
  ...nonfiniteFunctions,
  ...clauses,
  ...conditionals,
  ...emphasisInversion,
  ...questionTags,
  ...prepositionCollocations,
  ...verbNounCollocations,
  ...referenceLogic,
]

export const foundationTopicBanks = [
  { topic: '名词、代词与可数/不可数', questions: nounsAndPronouns },
  { topic: '主谓一致与数量表达', questions: agreementAndQuantity },
  { topic: '一般时、进行时、完成时', questions: basicTenses },
  { topic: '被动语态', questions: passiveVoice },
  { topic: '冠词、连词与基础介词', questions: articlesConjunctionsPrepositions },
  { topic: '形容词、副词及比较级', questions: adjectivesAndAdverbs },
  { topic: '常用动词搭配', questions: verbCollocations },
  { topic: '日常交际与固定表达', questions: dailyExpressions },
  { topic: '词义辨析与词性判断', questions: wordMeaningAndClass },
  { topic: '不定式、动名词和分词', questions: nonfiniteForms },
  { topic: '非谓语作定语、状语与宾补', questions: nonfiniteFunctions },
  { topic: '宾语从句、定语从句和状语从句', questions: clauses },
  { topic: '条件句与虚拟语气', questions: conditionals },
  { topic: '强调句、倒装句与省略', questions: emphasisInversion },
  { topic: '反意疑问句和祈使句附加问句', questions: questionTags },
  { topic: '高频介词与形容词搭配', questions: prepositionCollocations },
  { topic: '高频动词短语与名词搭配', questions: verbNounCollocations },
  { topic: '指代、替代与逻辑连接', questions: referenceLogic },
]

export const grammarFoundationQuestions = validateQuestionBank(grammarFoundationItems)
export const grammarAdvancedQuestions = validateQuestionBank(grammarAdvancedItems)
export const clozeQuestionBank = validateQuestionBank(clozeItems)
export const readingQuestionBank = validateQuestionBank(readingItems)
export const allPassages: Passage[] = [...clozePassages, ...readingPassages]
export const clozeAssignmentIssues = clozeQuestionBank.success
  ? validateClozeAssignments(clozeQuestionBank.questions, allPassages).issues
  : clozeQuestionBank.issues
export const readingAssignmentIssues = readingQuestionBank.success
  ? validatePassageAssignments(readingQuestionBank.questions, allPassages).issues
  : readingQuestionBank.issues
export const allQuestions = validateQuestionBank([
  ...diagnosticItems,
  ...grammarFoundationItems,
  ...grammarAdvancedItems,
  ...clozeItems,
  ...readingItems,
])
