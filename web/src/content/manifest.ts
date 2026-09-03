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

export const grammarFoundationQuestions = validateQuestionBank(grammarFoundationItems)
export const allQuestions = validateQuestionBank([...diagnosticItems, ...grammarFoundationItems])
