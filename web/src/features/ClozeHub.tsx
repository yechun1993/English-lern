import type { Question } from '../domain/question'
import type { Passage } from '../domain/passage'
import { FixedBackButton } from '../components/FixedBackButton'
import './ClozeHub.css'

export interface ClozeBank {
  passage: Passage
  questions: Question[]
}

interface ClozeHubProps {
  banks: ClozeBank[]
  onBack: () => void
  onStart: (bank: ClozeBank) => void
}

export function ClozeHub({ banks, onBack, onStart }: ClozeHubProps) {
  return (
    <main className="cloze-shell">
      <FixedBackButton label="返回今日学习" onBack={onBack} />
      <header className="cloze-header">
        <p className="eyebrow">20 空三选一 · 逐篇突破</p>
        <h1>完形填空</h1>
        <p>每次选择一篇文章。先通读全文，再逐空核对搭配、逻辑和词义。</p>
      </header>

      <section aria-label="完形篇章" className="cloze-grid">
        {banks.map((bank, index) => (
          <button
            aria-label={`${bank.passage.title} · ${bank.questions.length} 空`}
            className="cloze-card"
            key={bank.passage.id}
            onClick={() => onStart(bank)}
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{bank.passage.title}</strong>
            <small>{bank.questions.length} 空 · 220–300 词</small>
          </button>
        ))}
      </section>
    </main>
  )
}
