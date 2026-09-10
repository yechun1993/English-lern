import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FixedBackButton } from './FixedBackButton'

describe('FixedBackButton', () => {
  it('uses an explicit label and delegates the return action', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<FixedBackButton label="返回专项" onBack={onBack} />)

    await user.click(screen.getByRole('button', { name: '返回专项' }))
    expect(onBack).toHaveBeenCalledOnce()
  })
})
