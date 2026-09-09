import { describe, expect, it } from 'vitest'
import type { LicenseState } from './license'
import { applyLicenseState } from './license-state'

describe('applyLicenseState', () => {
  it('保留重复的授权失败状态对象，避免无意义的状态更新', () => {
    const current: LicenseState = { status: 'error' }

    expect(applyLicenseState(current, { status: 'error' })).toBe(current)
  })

  it('在授权信息变化时采用新的状态', () => {
    const current: LicenseState = {
      status: 'ready',
      authorizationId: 'SZU-2026-0001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }
    const next: LicenseState = {
      status: 'ready',
      authorizationId: 'SZU-2026-0002',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }

    expect(applyLicenseState(current, next)).toBe(next)
  })

  it('保留相同授权信息的原状态对象', () => {
    const current: LicenseState = {
      status: 'ready',
      authorizationId: 'SZU-2026-0001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }

    expect(applyLicenseState(current, { ...current })).toBe(current)
  })
})
