import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PwaStatusNotice } from './PwaUpdateNotice'

describe('PwaStatusNotice', () => {
  it('tells the learner when the site is ready for offline use and can be dismissed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(<PwaStatusNotice offlineReady onClose={onClose} onUpdate={vi.fn()} updateAvailable={false} />)

    expect(screen.getByText('已可离线使用')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '关闭提示' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('prioritizes a new-version prompt and updates only after the learner chooses it', async () => {
    const user = userEvent.setup()
    const onUpdate = vi.fn()

    render(<PwaStatusNotice offlineReady onClose={vi.fn()} onUpdate={onUpdate} updateAvailable />)

    expect(screen.getByText('发现新版本')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '立即更新' }))
    expect(onUpdate).toHaveBeenCalledOnce()
  })
})
