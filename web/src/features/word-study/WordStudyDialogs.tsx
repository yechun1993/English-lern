import { type FormEvent, useEffect, useId, useRef, useState } from 'react'
import './WordStudyDialogs.css'

export interface WordGoalDialogProps {
  availableCount: number
  canCancel: boolean
  emptyScope?: 'all' | 'initial'
  onBack: () => void
  onCancel: () => void
  onStart: (requestedSize: number) => void
  onViewMastered: () => void
}

export interface WordBatchChangeDialogProps {
  availableCount: number
  description: string
  requestedSize: number
  onCancel: () => void
  onConfirm: () => void
}

export interface WordBatchCompleteDialogProps {
  onContinue: () => void
  onRest: () => void
}

function useEscapeToCancel(canCancel: boolean, onCancel: () => void) {
  useEffect(() => {
    if (!canCancel) return undefined

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [canCancel, onCancel])
}

function useModalFocus() {
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const activeDialog = dialog
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ))
    const first = dialog.querySelector<HTMLInputElement>('input:not([disabled])') ?? focusable()[0]
    first?.focus()

    function keepFocusInside(event: FocusEvent) {
      if (!activeDialog.contains(event.target as Node)) focusable()[0]?.focus()
    }

    function trapTab(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      const items = focusable()
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const active = document.activeElement
      const currentIndex = items.indexOf(active as HTMLElement)
      if (currentIndex < 0 || (event.shiftKey && currentIndex === 0) || (!event.shiftKey && currentIndex === items.length - 1)) {
        event.preventDefault()
        const next = event.shiftKey ? items[items.length - 1] : items[0]
        next.focus()
      }
    }

    document.addEventListener('focusin', keepFocusInside)
    document.addEventListener('keydown', trapTab)
    return () => {
      document.removeEventListener('focusin', keepFocusInside)
      document.removeEventListener('keydown', trapTab)
      const nextDialog = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]'))
        .some((element) => element !== dialog)
      if (previousFocus?.isConnected && !nextDialog) previousFocus.focus()
    }
  }, [])

  return dialogRef
}

export function WordGoalDialog({
  availableCount,
  canCancel,
  emptyScope = 'all',
  onBack,
  onCancel,
  onStart,
  onViewMastered,
}: WordGoalDialogProps) {
  const titleId = useId()
  const inputId = useId()
  const errorId = useId()
  const [inputValue, setInputValue] = useState('30')
  const [edited, setEdited] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useModalFocus()

  useEscapeToCancel(canCancel, onCancel)

  function submitGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!/^\d+$/.test(inputValue)) {
      setError('请输入不小于1的整数')
      return
    }

    const requestedSize = Number(inputValue)
    if (!Number.isInteger(requestedSize) || requestedSize < 1) {
      setError('请输入不小于1的整数')
      return
    }

    if (requestedSize > availableCount) {
      setError(`当前最多可背${availableCount}个单词`)
      return
    }

    setError(null)
    onStart(requestedSize)
  }

  return (
    <div className="word-dialog-backdrop">
      <section aria-labelledby={titleId} aria-modal="true" className="word-dialog" ref={dialogRef} role="dialog">
        {availableCount === 0 ? (
          <>
            <h2 id={titleId}>{emptyScope === 'initial' ? '当前首字母下暂无可背单词' : '全部单词已掌握'}</h2>
            <p>{emptyScope === 'initial' ? '可取消后在本轮完成提示中选择继续背，新目标将按顺序单词开始。' : '当前没有待背单词，可以回顾已掌握的内容。'}</p>
            <div className="word-dialog-actions">
              {canCancel && (
                <button className="word-dialog-secondary-action" onClick={onCancel} type="button">
                  取消
                </button>
              )}
              <button className="word-dialog-secondary-action" onClick={onBack} type="button">
                返回今日学习
              </button>
              {emptyScope === 'all' && <button onClick={onViewMastered} type="button">查看已掌握单词</button>}
            </div>
          </>
        ) : (
          <>
            <h2 id={titleId}>设置本次背诵目标</h2>
            <p>当前有{availableCount}个单词可供背诵。</p>
            <form noValidate onSubmit={submitGoal}>
              <label htmlFor={inputId}>本次背诵数量目标</label>
              <input
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? 'true' : undefined}
                className={edited ? 'is-edited-value' : 'is-default-value'}
                id={inputId}
                inputMode="numeric"
                min="1"
                onChange={(event) => {
                  setInputValue(event.target.value)
                  setEdited(true)
                  setError(null)
                }}
                step="1"
                type="number"
                value={inputValue}
              />
              {error && <p className="word-dialog-error" id={errorId} role="alert">{error}</p>}
              <div className="word-dialog-actions">
                {canCancel && (
                  <button className="word-dialog-secondary-action" onClick={onCancel} type="button">
                    取消
                  </button>
                )}
                <button className="word-dialog-secondary-action" onClick={onBack} type="button">返回今日学习</button>
                <button type="submit">开背</button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

export function WordBatchChangeDialog({
  availableCount,
  description,
  requestedSize,
  onCancel,
  onConfirm,
}: WordBatchChangeDialogProps) {
  const titleId = useId()
  const dialogRef = useModalFocus()
  useEscapeToCancel(true, onCancel)

  return (
    <div className="word-dialog-backdrop">
      <section aria-labelledby={titleId} aria-modal="true" className="word-dialog" ref={dialogRef} role="dialog">
        <h2 id={titleId}>重新生成本轮单词？</h2>
        <p>{description}</p>
        {availableCount === 0 && <p>该条件下暂无可背单词</p>}
        {availableCount < requestedSize && <p>当前最多可提供{availableCount}个。</p>}
        <div className="word-dialog-actions">
          <button className="word-dialog-secondary-action" onClick={onCancel} type="button">
            取消
          </button>
          <button disabled={availableCount === 0} onClick={onConfirm} type="button">
            确认重新生成
          </button>
        </div>
      </section>
    </div>
  )
}

export function WordBatchCompleteDialog({
  onContinue,
  onRest,
}: WordBatchCompleteDialogProps) {
  const titleId = useId()
  const dialogRef = useModalFocus()

  return (
    <div className="word-dialog-backdrop">
      <section aria-labelledby={titleId} aria-modal="true" className="word-dialog" ref={dialogRef} role="dialog">
        <h2 id={titleId}>本轮背诵完成</h2>
        <p>建议劳逸结合，不要急功近利哦～</p>
        <div className="word-dialog-actions">
          <button className="word-dialog-secondary-action" onClick={onRest} type="button">
            先休息一下
          </button>
          <button onClick={onContinue} type="button">继续背</button>
        </div>
      </section>
    </div>
  )
}
