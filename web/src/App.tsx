import { useMemo, useState } from 'react'
import {
  allQuestions,
  clozeAssignmentIssues,
  clozeQuestionBank,
  diagnosticQuestions,
  foundationTopicBanks,
  allPassages,
  readingAssignmentIssues,
  readingQuestionBank,
} from './content/manifest'
import { LocalStudyRepository } from './data/study-repository'
import { PracticeSession } from './features/PracticeSession'
import { TopicHub, type TopicBank } from './features/TopicHub'
import { ClozeHub, type ClozeBank } from './features/ClozeHub'
import { ReadingHub, type ReadingBank } from './features/ReadingHub'
import type { Question } from './domain/question'
import type { Passage } from './domain/passage'
import { daysUntilExam } from './domain/exam-date'
import './App.css'

type Screen = 'dashboard' | 'topics' | 'cloze' | 'reading' | 'practice'

interface PracticeTarget {
  title: string
  questions: Question[]
  passages?: Passage[]
  returnTo: Exclude<Screen, 'practice'>
}

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [practiceTarget, setPracticeTarget] = useState<PracticeTarget | null>(null)
  const repository = useMemo(() => new LocalStudyRepository(window.localStorage), [])
  const [dashboard, setDashboard] = useState(() => repository.getDashboard())
  const remainingDays = daysUntilExam(new Date())
  const clozeBanks = useMemo<ClozeBank[]>(() => {
    if (!clozeQuestionBank.success || clozeAssignmentIssues.length > 0) {
      return []
    }

    return allPassages
      .filter((passage) => passage.type === 'cloze')
      .map((passage) => ({
        passage,
        questions: clozeQuestionBank.questions.filter((question) => question.passageId === passage.id),
      }))
  }, [])
  const readingBanks = useMemo<ReadingBank[]>(() => {
    if (!readingQuestionBank.success || readingAssignmentIssues.length > 0) {
      return []
    }

    return allPassages
      .filter((passage) => passage.type === 'reading')
      .map((passage) => ({
        passage,
        questions: readingQuestionBank.questions.filter((question) => question.passageId === passage.id),
      }))
  }, [])
  const dueReviewQuestions = useMemo(() => {
    if (!allQuestions.success) {
      return []
    }

    const questionsById = new Map(allQuestions.questions.map((question) => [question.id, question]))
    return repository
      .listDueReviews(new Date())
      .map(({ questionId }) => questionsById.get(questionId))
      .filter((question): question is Question => question !== undefined)
  }, [dashboard.dueReviewCount, repository])

  if (!diagnosticQuestions.success) {
    return (
      <main className="app-shell">
        <h1>题库暂时无法加载</h1>
        <p>{diagnosticQuestions.issues.join('；')}</p>
      </main>
    )
  }

  function startPractice(
    title: string,
    questions: Question[],
    returnTo: PracticeTarget['returnTo'] = 'dashboard',
    passages?: Passage[],
  ) {
    setPracticeTarget({ title, questions, returnTo, passages })
    setScreen('practice')
  }

  function recordAnswer(question: Question, answer: string, correct: boolean, guessed: boolean) {
    repository.recordAttempt({
      id: `attempt-${question.id}-${Date.now()}`,
      questionId: question.id,
      answer,
      correct,
      guessed,
      createdAt: new Date().toISOString(),
    })
    setDashboard(repository.getDashboard())
  }

  if (screen === 'practice' && practiceTarget) {
    return (
      <PracticeSession
        onAnswer={recordAnswer}
        onComplete={() => setScreen(practiceTarget.returnTo)}
        passages={practiceTarget.passages}
        questions={practiceTarget.questions}
        title={practiceTarget.title}
      />
    )
  }

  if (screen === 'topics') {
    return (
      <TopicHub
        banks={foundationTopicBanks}
        onBack={() => setScreen('dashboard')}
        onStart={(bank: TopicBank) => startPractice(bank.topic, bank.questions, 'topics')}
      />
    )
  }

  if (screen === 'cloze') {
    return (
      <ClozeHub
        banks={clozeBanks}
        onBack={() => setScreen('dashboard')}
        onStart={(bank) => startPractice(`完形填空 · ${bank.passage.title}`, bank.questions, 'cloze', [bank.passage])}
      />
    )
  }

  if (screen === 'reading') {
    return (
      <ReadingHub
        banks={readingBanks}
        onBack={() => setScreen('dashboard')}
        onStart={(bank) => startPractice(`阅读理解 · ${bank.passage.title}`, bank.questions, 'reading', [bank.passage])}
      />
    )
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">深圳大学学位英语 · 60 分攻关</p>
          <h1>今日学习</h1>
          <p className="subtitle">按题型逐点突破，先稳定拿到及格分。</p>
        </div>
        <div className="header-actions">
          <button className="topic-entry" onClick={() => setScreen('topics')} type="button">专项突破</button>
          <div className="exam-countdown" aria-label="考试倒计时">
            <span>距离 10 月 17 日</span>
            <strong>{remainingDays} 天</strong>
          </div>
        </div>
      </header>

      <section className="progress-card" aria-labelledby="today-goal">
        <div>
          <p className="eyebrow">今日目标</p>
          <h2 id="today-goal">完成 30 分钟语法基础练习</h2>
        </div>
        <p className="progress-text">已完成 <strong>{dashboard.attemptCount}</strong> 题</p>
      </section>

      <section aria-labelledby="study-plan-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">学习路径</p>
            <h2 id="study-plan-title">接下来做什么</h2>
          </div>
          <span className="target-badge">目标：63 分</span>
        </div>

        <div className="task-grid">
          {[
            {
              title: '语法与词汇',
              detail: '先做 20 题诊断，确定最该补的基础点',
              action: '开始练习',
              onClick: () => startPractice('诊断练习', diagnosticQuestions.questions),
            },
            {
              title: '完形填空',
              detail: `${clozeBanks.length} 篇 · ${clozeBanks.reduce((total, bank) => total + bank.questions.length, 0)} 空`,
              action: '选择篇章',
              onClick: clozeQuestionBank.success && clozeAssignmentIssues.length === 0
                ? () => setScreen('cloze')
                : undefined,
            },
            {
              title: '阅读理解',
              detail: `${readingBanks.length} 篇 · ${readingBanks.reduce((total, bank) => total + bank.questions.length, 0)} 题`,
              action: '选择阅读',
              onClick: readingQuestionBank.success && readingAssignmentIssues.length === 0
                ? () => setScreen('reading')
                : undefined,
            },
            {
              title: '错题回顾',
              detail: `有 ${dashboard.dueReviewCount} 题到期复习`,
              action: '去复习',
              onClick: dueReviewQuestions.length > 0
                ? () => startPractice('到期复习', dueReviewQuestions)
                : undefined,
            },
          ].map((task, index) => (
            <article className="task-card" key={task.title}>
              <span className="task-index">0{index + 1}</span>
              <h3>{task.title}</h3>
              <p>{task.detail}</p>
              <button
                type="button"
                disabled={!task.onClick}
                onClick={task.onClick}
              >
                {task.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="study-note" aria-label="学习提示">
        <span aria-hidden="true">◎</span>
        <p>
          先完成一道题型的短练，再看解析和易错点；不需要一开始做完整套卷。
        </p>
      </aside>
    </main>
  )
}

export default App
