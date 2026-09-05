import { useMemo, useState } from 'react'
import {
  loadAllQuestionsForReview,
  loadClozePractice,
  loadDiagnosticPractice,
  loadGrammarTopics,
  loadReadingPractice,
  loadTranslationPractice,
  loadWritingPractice,
} from './content/loaders'
import { studyContentSummary } from './content/summary'
import { LocalStudyRepository } from './data/study-repository'
import { PracticeSession } from './features/PracticeSession'
import { TopicHub, type TopicBank } from './features/TopicHub'
import { ClozeHub, type ClozeBank } from './features/ClozeHub'
import { ReadingHub, type ReadingBank } from './features/ReadingHub'
import { SubjectiveHub, type SubjectiveTopicBank } from './features/SubjectiveHub'
import { SubjectiveSession } from './features/SubjectiveSession'
import { PwaUpdateNotice } from './components/PwaUpdateNotice'
import type { Question } from './domain/question'
import type { Passage } from './domain/passage'
import { daysUntilExam } from './domain/exam-date'
import './App.css'

type Screen = 'dashboard' | 'topics' | 'cloze' | 'reading' | 'translation' | 'writing' | 'practice' | 'subjective'

interface PracticeTarget {
  title: string
  questions: Question[]
  passages?: Passage[]
  returnTo: Exclude<Screen, 'practice'>
}

interface SubjectiveTarget {
  title: string
  questions: Question[]
  returnTo: Exclude<Screen, 'subjective'>
  initialDrafts: Record<string, string>
}

function App() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [practiceTarget, setPracticeTarget] = useState<PracticeTarget | null>(null)
  const [subjectiveTarget, setSubjectiveTarget] = useState<SubjectiveTarget | null>(null)
  const repository = useMemo(() => new LocalStudyRepository(window.localStorage), [])
  const [dashboard, setDashboard] = useState(() => repository.getDashboard())
  const [topicBanks, setTopicBanks] = useState<TopicBank[]>([])
  const [clozeBanks, setClozeBanks] = useState<ClozeBank[]>([])
  const [readingBanks, setReadingBanks] = useState<ReadingBank[]>([])
  const [translationBanks, setTranslationBanks] = useState<SubjectiveTopicBank[]>([])
  const [writingBanks, setWritingBanks] = useState<SubjectiveTopicBank[]>([])
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [contentError, setContentError] = useState<string | null>(null)
  const remainingDays = daysUntilExam(new Date())

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

  function reportContentIssues(issues: string[]) {
    setContentError(issues.length > 0 ? issues.join('；') : '题库暂时无法加载，请稍后重试。')
  }

  async function runContentLoad(task: () => Promise<void>) {
    setIsContentLoading(true)
    setContentError(null)

    try {
      await task()
    } catch {
      setContentError('题库加载失败，请检查网络或刷新页面后重试。')
    } finally {
      setIsContentLoading(false)
    }
  }

  function openDiagnosticPractice() {
    void runContentLoad(async () => {
      const questionBank = await loadDiagnosticPractice()
      if (!questionBank.success) {
        reportContentIssues(questionBank.issues)
        return
      }

      startPractice('诊断练习', questionBank.questions)
    })
  }

  function openTopicHub() {
    void runContentLoad(async () => {
      setTopicBanks(await loadGrammarTopics())
      setScreen('topics')
    })
  }

  function openClozeHub() {
    void runContentLoad(async () => {
      const content = await loadClozePractice()
      if (!content.questionBank.success || content.assignmentIssues.length > 0) {
        reportContentIssues(content.questionBank.success ? content.assignmentIssues : content.questionBank.issues)
        return
      }

      setClozeBanks(content.passages.map((passage) => ({
        passage,
        questions: content.questionBank.questions.filter((question) => question.passageId === passage.id),
      })))
      setScreen('cloze')
    })
  }

  function openReadingHub() {
    void runContentLoad(async () => {
      const content = await loadReadingPractice()
      if (!content.questionBank.success || content.assignmentIssues.length > 0) {
        reportContentIssues(content.questionBank.success ? content.assignmentIssues : content.questionBank.issues)
        return
      }

      setReadingBanks(content.passages.map((passage) => ({
        passage,
        questions: content.questionBank.questions.filter((question) => question.passageId === passage.id),
      })))
      setScreen('reading')
    })
  }

  function openTranslationHub() {
    void runContentLoad(async () => {
      const content = await loadTranslationPractice()
      if (!content.questionBank.success) {
        reportContentIssues(content.questionBank.issues)
        return
      }

      setTranslationBanks(content.topicBanks)
      setScreen('translation')
    })
  }

  function openWritingHub() {
    void runContentLoad(async () => {
      const content = await loadWritingPractice()
      if (!content.questionBank.success) {
        reportContentIssues(content.questionBank.issues)
        return
      }

      setWritingBanks(content.questions.map((question) => ({ topic: question.topic, questions: [question] })))
      setScreen('writing')
    })
  }

  function openDueReviews() {
    void runContentLoad(async () => {
      const questionBank = await loadAllQuestionsForReview()
      if (!questionBank.success) {
        reportContentIssues(questionBank.issues)
        return
      }

      const questionsById = new Map(questionBank.questions.map((question) => [question.id, question]))
      const dueReviewQuestions = repository
        .listDueReviews(new Date())
        .map(({ questionId }) => questionsById.get(questionId))
        .filter((question): question is Question => question !== undefined)

      if (dueReviewQuestions.length === 0) {
        setContentError('暂时没有可开始的到期复习题。')
        return
      }

      startPractice('到期复习', dueReviewQuestions)
    })
  }

  function startSubjective(
    title: string,
    questions: Question[],
    returnTo: SubjectiveTarget['returnTo'] = 'translation',
  ) {
    const initialDrafts: Record<string, string> = {}
    for (const question of questions) {
      const draft = repository.getDraft(question.id)
      if (draft) {
        initialDrafts[question.id] = draft.content
      }
    }

    setSubjectiveTarget({ title, questions, returnTo, initialDrafts })
    setScreen('subjective')
  }

  function saveSubjectiveDraft(question: Question, content: string) {
    repository.saveDraft({
      questionId: question.id,
      content,
      updatedAt: new Date().toISOString(),
    })
    setSubjectiveTarget((target) => target
      ? { ...target, initialDrafts: { ...target.initialDrafts, [question.id]: content } }
      : target)
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

  if (screen === 'subjective' && subjectiveTarget) {
    return (
      <SubjectiveSession
        initialDrafts={subjectiveTarget.initialDrafts}
        onComplete={() => setScreen(subjectiveTarget.returnTo)}
        onSaveDraft={saveSubjectiveDraft}
        questions={subjectiveTarget.questions}
        title={subjectiveTarget.title}
      />
    )
  }

  if (screen === 'topics') {
    return (
      <TopicHub
        banks={topicBanks}
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

  if (screen === 'translation') {
    return (
      <SubjectiveHub
        banks={translationBanks}
        cardHint="先翻译后对照"
        description="每次练一个句型专题。先独立写出英文，再主动查看参考译文和自检清单。"
        eyebrow="汉译英 · 先输出后自检"
        itemUnit="句"
        onBack={() => setScreen('dashboard')}
        onStart={(bank) => startSubjective(`汉译英 · ${bank.topic}`, bank.questions, 'translation')}
        sectionLabel="汉译英专项"
        title="汉译英"
      />
    )
  }

  if (screen === 'writing') {
    return (
      <SubjectiveHub
        banks={writingBanks}
        cardHint="先写后对照"
        description="每次只写一个题目。先按三点提纲完成自己的作文，再主动查看范文和自检清单。"
        eyebrow="写作 · 先完成自己的表达"
        itemUnit="题"
        onBack={() => setScreen('dashboard')}
        onStart={(bank) => startSubjective(`写作 · ${bank.topic}`, bank.questions, 'writing')}
        sectionLabel="写作题目"
        title="写作"
      />
    )
  }

  return (
    <main className="app-shell">
      <PwaUpdateNotice />
      <header className="site-header">
        <div>
          <p className="eyebrow">深圳大学学位英语 · 60 分攻关</p>
          <h1>今日学习</h1>
          <p className="subtitle">按题型逐点突破，先稳定拿到及格分。</p>
        </div>
        <div className="header-actions">
          <button className="topic-entry" disabled={isContentLoading} onClick={openTopicHub} type="button">专项突破</button>
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

      {isContentLoading && <p className="content-status" role="status">正在加载题库…</p>}
      {contentError && <p className="content-error" role="alert">{contentError}</p>}

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
              onClick: openDiagnosticPractice,
            },
            {
              title: '完形填空',
              detail: `${studyContentSummary.cloze.passages} 篇 · ${studyContentSummary.cloze.questions} 空`,
              action: '选择篇章',
              onClick: openClozeHub,
            },
            {
              title: '阅读理解',
              detail: `${studyContentSummary.reading.passages} 篇 · ${studyContentSummary.reading.questions} 题`,
              action: '选择阅读',
              onClick: openReadingHub,
            },
            {
              title: '汉译英',
              detail: `${studyContentSummary.translation.topics} 个专题 · ${studyContentSummary.translation.questions} 句`,
              action: '选择专题',
              onClick: openTranslationHub,
            },
            {
              title: '写作',
              detail: `${studyContentSummary.writing.prompts} 个题目 · 含三点提纲和范文`,
              action: '选择题目',
              onClick: openWritingHub,
            },
            {
              title: '错题回顾',
              detail: `有 ${dashboard.dueReviewCount} 题到期复习`,
              action: '去复习',
              onClick: dashboard.dueReviewCount > 0
                ? openDueReviews
                : undefined,
            },
          ].map((task, index) => (
            <article className="task-card" key={task.title}>
              <span className="task-index">0{index + 1}</span>
              <h3>{task.title}</h3>
              <p>{task.detail}</p>
              <button
                type="button"
                disabled={!task.onClick || isContentLoading}
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
