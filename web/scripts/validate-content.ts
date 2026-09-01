import { allQuestions } from '../src/content/manifest'

if (!allQuestions.success) {
  console.error('题库校验失败：')
  for (const issue of allQuestions.issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

console.log(`题库校验通过：共 ${allQuestions.questions.length} 道题。`)
