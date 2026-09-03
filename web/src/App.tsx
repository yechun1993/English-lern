import { useMemo, useState } from 'react'
import { diagnosticQuestions } from './content/manifest'
import { LocalStudyRepository } from './data/study-repository'
import { PracticeSession } from './features/PracticeSession'
import './App.css'

const todayTasks = [
  { title: '语法与词汇', detail: '冠词与可数名词 · 12 题', action: '开始练习' },
  { title: '完形填空', detail: '高频搭配辨析 · 1 篇', action: '继续学习' },
  { title: '错题回顾', detail: '有 6 题到期复习', action: '去复习' },
]

function App() {
  const [screen, setScreen] = useState<'dashboard' | 'diagnostic'>('dashboard')
  const repository = useMemo(() => new LocalStudyRepository(window.localStorage), [])

  if (!diagnosticQuestions.success) {
    return (
      <main className="app-shell">
        <h1>题库暂时无法加载</h1>
        <p>{diagnosticQuestions.issues.join('；')}</p>
      </main>
    )
  }

  if (screen === 'diagnostic') {
    return (
      <PracticeSession
        onAnswer={(question, answer, correct, guessed) => {
          repository.recordAttempt({
            id: `attempt-${question.id}-${Date.now()}`,
            questionId: question.id,
            answer,
            correct,
            guessed,
            createdAt: new Date().toISOString(),
          })
        }}
        onComplete={() => setScreen('dashboard')}
        questions={diagnosticQuestions.questions}
        title="诊断练习"
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
        <div className="exam-countdown" aria-label="考试倒计时">
          <span>距离 10 月 17 日</span>
          <strong>46 天</strong>
        </div>
      </header>

      <section className="progress-card" aria-labelledby="today-goal">
        <div>
          <p className="eyebrow">今日目标</p>
          <h2 id="today-goal">完成 30 分钟语法基础练习</h2>
        </div>
        <p className="progress-text">本周进度 <strong>0 / 10</strong> 个学习单元</p>
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
          {todayTasks.map((task, index) => (
            <article className="task-card" key={task.title}>
              <span className="task-index">0{index + 1}</span>
              <h3>{task.title}</h3>
              <p>{task.detail}</p>
              <button type="button" onClick={index === 0 ? () => setScreen('diagnostic') : undefined}>
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
