import { writeFileSync } from 'node:fs'
import { allQuestions } from '../src/content/manifest'
import { serializeContentBank } from '../src/content/content-report'

if (!allQuestions.success) {
  console.error('无法导出题库：')
  for (const issue of allQuestions.issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

writeFileSync('content-backup.json', serializeContentBank(allQuestions.questions))
console.log(`已导出 ${allQuestions.questions.length} 道题到 content-backup.json`)
