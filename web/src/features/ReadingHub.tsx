import type { Question } from '../domain/question'
import type { Passage } from '../domain/passage'
import './ReadingHub.css'

export interface ReadingBank {
  passage: Passage
  questions: Question[]
}

interface ReadingHubProps {
  banks: ReadingBank[]
  onBack: () => void
  onStart: (bank: ReadingBank) => void
}

export function ReadingHub({ banks, onBack, onStart }: ReadingHubProps) {
  return (
    <main className="reading-shell">
      <header className="reading-header">
        <button className="back-button" onClick={onBack} type="button">返回今日学习</button>
        <p className="eyebrow">4 题四选一 · 逐篇突破</p>
        <h1>阅读理解</h1>
        <p>每次选择一篇文章。先快速通读，再用细节、词义、推断和主旨四类题目检查理解。</p>
      </header>

      <section aria-label="阅读篇章" className="reading-grid">
        {banks.map((bank, index) => (
          <button
            aria-label={`${bank.passage.title} · ${bank.questions.length} 题`}
            className="reading-card"
            key={bank.passage.id}
            onClick={() => onStart(bank)}
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{bank.passage.title}</strong>
            <small>{bank.questions.length} 题 · 220–300 词</small>
          </button>
        ))}
      </section>
    </main>
  )
}
