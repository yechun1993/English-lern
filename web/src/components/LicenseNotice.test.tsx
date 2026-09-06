import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LicenseNotice } from './LicenseNotice'

describe('LicenseNotice', () => {
  it('shows the authorization ID and fixed usage restriction', () => {
    render(<LicenseNotice state={{
      status: 'ready',
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }} />)

    expect(screen.getByLabelText('授权信息')).toHaveTextContent('授权编号：SZU-2026-001')
    expect(screen.getByLabelText('授权信息')).toHaveTextContent('仅授权个人学习使用，禁止转发、复制、售卖')
  })

  it('does not invent an ID if the authorization file cannot be loaded', () => {
    render(<LicenseNotice state={{ status: 'error' }} />)

    expect(screen.getByRole('alert')).toHaveTextContent('授权信息加载失败，请联系卖家')
  })
})
