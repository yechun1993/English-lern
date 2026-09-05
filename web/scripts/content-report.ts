import { allQuestions } from '../src/content/manifest'
import { createContentReport, formatContentReport } from '../src/content/content-report'

if (!allQuestions.success) {
  console.error('无法生成题库报告：')
  for (const issue of allQuestions.issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

console.log(formatContentReport(createContentReport(allQuestions.questions)))
