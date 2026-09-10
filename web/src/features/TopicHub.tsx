import type { Question } from '../domain/question'
import { FixedBackButton } from '../components/FixedBackButton'
import './TopicHub.css'

export interface TopicBank {
  topic: string
  questions: Question[]
}

interface TopicHubProps {
  banks: TopicBank[]
  onBack: () => void
  onStart: (bank: TopicBank) => void
}

export function TopicHub({ banks, onBack, onStart }: TopicHubProps) {
  return (
    <main className="topic-shell">
      <FixedBackButton label="返回今日学习" onBack={onBack} />
      <header className="topic-header">
        <p className="eyebrow">词汇与语法 · 基础专项</p>
        <h1>专项突破</h1>
        <p>每次只练一个知识点。先做基础题，再根据错因回到对应专题。</p>
      </header>

      <section aria-label="基础语法微专题" className="topic-grid">
        {banks.map((bank, index) => (
          <button
            aria-label={`${bank.topic} · ${bank.questions.length} 题`}
            className="topic-card"
            key={bank.topic}
            onClick={() => onStart(bank)}
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{bank.topic}</strong>
            <small>{bank.questions.length} 题 · 基础</small>
          </button>
        ))}
      </section>
    </main>
  )
}
