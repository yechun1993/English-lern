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
]

export const grammarFoundationQuestions = validateQuestionBank(grammarFoundationItems)
export const allQuestions = validateQuestionBank([...diagnosticItems, ...grammarFoundationItems])
