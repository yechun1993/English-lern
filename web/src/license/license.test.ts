import { describe, expect, it, vi } from 'vitest'
import { loadLicense } from './license'

describe('loadLicense', () => {
  it('returns a ready state for the required authorization metadata', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }), { status: 200 }))

    await expect(loadLicense(fetchImpl)).resolves.toEqual({
      status: 'ready',
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    })
    expect(fetchImpl).toHaveBeenCalledWith('/license.json', { cache: 'no-store' })
  })

  it('returns an error state for a missing or malformed authorization file', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{"authorizationId":""}', { status: 200 }))

    await expect(loadLicense(fetchImpl)).resolves.toEqual({ status: 'error' })
  })
})
