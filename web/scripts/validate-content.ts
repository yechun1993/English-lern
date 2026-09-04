import { allQuestions, clozeAssignmentIssues, readingAssignmentIssues } from '../src/content/manifest'
import { collectContentIssues } from '../src/content/content-validation'

const contentIssues = collectContentIssues(
  allQuestions.success ? [] : allQuestions.issues,
  [...clozeAssignmentIssues, ...readingAssignmentIssues],
)

if (contentIssues.length > 0) {
  console.error('题库校验失败：')
  for (const issue of contentIssues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

console.log(`题库校验通过：共 ${allQuestions.questions.length} 道题。`)
