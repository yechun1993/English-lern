import { useState } from 'react'
import { FixedBackButton } from '../components/FixedBackButton'
import type { Question } from '../domain/question'
import './SubjectiveSession.css'

export interface SubjectiveSessionProps {
  title: string
  questions: Question[]
  initialDrafts?: Record<string, string>
  onBack: () => void
  onComplete: () => void
  onSaveDraft?: (question: Question, content: string) => void
}

function answerLabel(question: Question): string {
  return question.type === 'writing' ? '我的作文' : '我的译文'
}

export function SubjectiveSession({
  title,
  questions,
  initialDrafts = {},
  onBack,
  onComplete,
  onSaveDraft,
}: SubjectiveSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const question = questions[currentIndex]
  const [draft, setDraft] = useState(() => (question ? initialDrafts[question.id] ?? '' : ''))
  const [isReferenceVisible, setIsReferenceVisible] = useState(false)

  if (!question) {
    return (
      <main className="subjective-shell">
        <FixedBackButton label="返回专项" onBack={onBack} />
        <h1>{title}</h1>
        <p>这一组题目正在准备中，请先回到学习首页。</p>
        <button type="button" onClick={onBack}>返回专项</button>
      </main>
    )
  }

  const isLastQuestion = currentIndex === questions.length - 1

  function saveDraft() {
    onSaveDraft?.(question, draft)
  }

  function handleBack() {
    saveDraft()
    onBack()
  }

  function revealReference() {
    saveDraft()
    setIsReferenceVisible(true)
  }

  function moveNext() {
    if (isLastQuestion) {
      onComplete()
      return
    }

    const nextQuestion = questions[currentIndex + 1]
    setCurrentIndex((index) => index + 1)
    setDraft(initialDrafts[nextQuestion.id] ?? '')
    setIsReferenceVisible(false)
  }

  return (
    <main className="subjective-shell">
      <FixedBackButton label="返回专项" onBack={handleBack} />
      <header className="subjective-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h1>第 {currentIndex + 1} / {questions.length} 题</h1>
        </div>
        <progress value={currentIndex + 1} max={questions.length} aria-label="练习进度" />
      </header>

      <article className="subjective-card">
        <p className="question-topic">{question.topic} · {question.difficulty === 'foundation' ? '基础' : '进阶'}</p>
        <h2>{question.stem}</h2>

        <label className="draft-field">
          <span>{answerLabel(question)}</span>
          <textarea
            aria-label={answerLabel(question)}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={question.type === 'writing' ? '先按提纲写出你的作文…' : '先写出你的英文译文…'}
            value={draft}
          />
        </label>

        {!isReferenceVisible && (
          <div className="subjective-actions">
            <button type="button" onClick={saveDraft}>保存草稿</button>
            <button type="button" onClick={revealReference}>保存草稿并查看参考答案</button>
          </div>
        )}

        {isReferenceVisible && (
          <section aria-label="参考答案与自检" className="reference-panel">
            <h3>参考答案</h3>
            <p>{question.referenceAnswer ?? question.answer}</p>
            {question.checklist && question.checklist.length > 0 && (
              <>
                <h3>自检清单</h3>
                <ul>
                  {question.checklist.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </>
            )}
            <p><strong>表达提示：</strong>{question.explanation}</p>
            <button type="button" onClick={moveNext}>
              {isLastQuestion ? '完成本组练习' : '下一题'}
            </button>
          </section>
        )}
      </article>
    </main>
  )
}
