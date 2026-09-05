import type { Question } from '../domain/question'
import './TopicHub.css'

export interface SubjectiveTopicBank {
  topic: string
  questions: Question[]
}

interface SubjectiveHubProps {
  banks: SubjectiveTopicBank[]
  cardHint: string
  description: string
  eyebrow: string
  itemUnit: string
  onBack: () => void
  onStart: (bank: SubjectiveTopicBank) => void
  sectionLabel: string
  title: string
}

export function SubjectiveHub({
  banks,
  cardHint,
  description,
  eyebrow,
  itemUnit,
  onBack,
  onStart,
  sectionLabel,
  title,
}: SubjectiveHubProps) {
  return (
    <main className="topic-shell">
      <header className="topic-header">
        <button className="back-button" onClick={onBack} type="button">返回今日学习</button>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <section aria-label={sectionLabel} className="topic-grid">
        {banks.map((bank, index) => (
          <button
            aria-label={`${bank.topic} · ${bank.questions.length} ${itemUnit}`}
            className="topic-card"
            key={bank.topic}
            onClick={() => onStart(bank)}
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{bank.topic}</strong>
            <small>{bank.questions.length} {itemUnit} · {cardHint}</small>
          </button>
        ))}
      </section>
    </main>
  )
}
