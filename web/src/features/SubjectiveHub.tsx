import type { Question } from '../domain/question'
import './TopicHub.css'

export interface SubjectiveTopicBank {
  topic: string
  questions: Question[]
}

interface SubjectiveHubProps {
  banks: SubjectiveTopicBank[]
  onBack: () => void
  onStart: (bank: SubjectiveTopicBank) => void
}

export function SubjectiveHub({ banks, onBack, onStart }: SubjectiveHubProps) {
  return (
    <main className="topic-shell">
      <header className="topic-header">
        <button className="back-button" onClick={onBack} type="button">返回今日学习</button>
        <p className="eyebrow">汉译英 · 先输出后自检</p>
        <h1>汉译英</h1>
        <p>每次练一个句型专题。先独立写出英文，再主动查看参考译文和自检清单。</p>
      </header>

      <section aria-label="汉译英专项" className="topic-grid">
        {banks.map((bank, index) => (
          <button
            aria-label={`${bank.topic} · ${bank.questions.length} 句`}
            className="topic-card"
            key={bank.topic}
            onClick={() => onStart(bank)}
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{bank.topic}</strong>
            <small>{bank.questions.length} 句 · 先翻译后对照</small>
          </button>
        ))}
      </section>
    </main>
  )
}
