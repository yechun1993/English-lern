import { useState } from 'react'
import type { Question } from '../domain/question'
import type { Passage } from '../domain/passage'
import './PracticeSession.css'

export interface PracticeSessionProps {
  title: string
  questions: Question[]
  passages?: Passage[]
  onComplete: () => void
  onAnswer?: (question: Question, answer: string, correct: boolean, guessed: boolean) => void
}

export function PracticeSession({ title, questions, passages, onComplete, onAnswer }: PracticeSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [guessed, setGuessed] = useState(false)

  const question = questions[currentIndex]

  if (!question) {
    return (
      <section className="practice-empty">
        <h1>{title}</h1>
        <p>这一组题目正在准备中，请先回到学习首页。</p>
        <button type="button" onClick={onComplete}>
          返回首页
        </button>
      </section>
    )
  }

  const isCorrect = selectedAnswer === question.answer
  const isLastQuestion = currentIndex === questions.length - 1
  const passage = question.passageId
    ? passages?.find((candidate) => candidate.id === question.passageId)
    : undefined

  function handleSelect(answer: string) {
    if (isChecked) {
      return
    }

    setSelectedAnswer(answer)
  }

  function handleCheck() {
    if (!selectedAnswer) {
      return
    }

    setIsChecked(true)
    onAnswer?.(question, selectedAnswer, selectedAnswer === question.answer, guessed)
  }

  function handleNext() {
    if (isLastQuestion) {
      onComplete()
      return
    }

    setCurrentIndex((index) => index + 1)
    setSelectedAnswer(null)
    setIsChecked(false)
    setGuessed(false)
  }

  return (
    <main className="practice-shell">
      <header className="practice-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h1>第 {currentIndex + 1} / {questions.length} 题</h1>
        </div>
        <progress value={currentIndex + 1} max={questions.length} aria-label="练习进度" />
      </header>

      <article className="question-card">
        {passage && question.type === 'cloze' && (
          <section aria-label="完形文章" className="cloze-passage">
            <h2>{passage.title}</h2>
            <p>
              {passage.body.split(/(\[\d{1,2}\])/g).map((part, index) => {
                const blankMatch = part.match(/^\[(\d{1,2})\]$/)
                if (!blankMatch) {
                  return part
                }

                const isActiveBlank = Number(blankMatch[1]) === question.blankIndex
                return (
                  <mark className={isActiveBlank ? 'active' : ''} key={`${part}-${index}`}>
                    {part}
                  </mark>
                )
              })}
            </p>
          </section>
        )}
        <p className="question-topic">{question.topic} · {question.difficulty === 'foundation' ? '基础' : '进阶'}</p>
        <h2>{question.stem}</h2>

        <div className="option-list" aria-label="题目选项">
          {question.options.map((option, index) => {
            const isChosen = selectedAnswer === option
            const isAnswer = option === question.answer
            const outcomeClass = isChecked
              ? isAnswer
                ? 'correct'
                : isChosen
                  ? 'incorrect'
                  : ''
              : isChosen
                ? 'selected'
                : ''

            return (
              <button
                aria-label={option}
                className={`option-button ${outcomeClass}`}
                disabled={isChecked}
                key={option}
                onClick={() => handleSelect(option)}
                type="button"
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option}
              </button>
            )
          })}
        </div>

        {!isChecked && (
          <div className="answer-actions">
            <label className="guess-control">
              <input
                checked={guessed}
                onChange={(event) => setGuessed(event.target.checked)}
                type="checkbox"
              />
              这题是猜的
            </label>
            <button disabled={!selectedAnswer} onClick={handleCheck} type="button">
              核对答案
            </button>
          </div>
        )}

        {isChecked && (
          <section className={`answer-feedback ${isCorrect && !guessed ? 'positive' : 'negative'}`} aria-live="polite">
            <h3>{isCorrect ? (guessed ? '答案正确，但已记为需复习' : '回答正确') : '这题先记下来'}</h3>
            <p>{question.explanation}</p>
            <p><strong>易错点：</strong>{question.misconception}</p>
            <button type="button" onClick={handleNext}>
              {isLastQuestion ? '完成本组练习' : '下一题'}
            </button>
          </section>
        )}
      </article>
    </main>
  )
}
