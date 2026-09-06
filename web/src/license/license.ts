export interface ReadyLicenseState {
  status: 'ready'
  authorizationId: string
  notice: string
}

export type LicenseState = ReadyLicenseState | { status: 'error' }

const authorizationIdPattern = /^[A-Za-z0-9_-]{3,64}$/
const requiredNotice = '仅授权个人学习使用，禁止转发、复制、售卖'

function isValidLicense(value: unknown): value is Omit<ReadyLicenseState, 'status'> {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return typeof candidate.authorizationId === 'string'
    && authorizationIdPattern.test(candidate.authorizationId)
    && candidate.notice === requiredNotice
}

export async function loadLicense(fetchImpl: typeof fetch = fetch): Promise<LicenseState> {
  try {
    const response = await fetchImpl('/license.json', { cache: 'no-store' })
    const value: unknown = response.ok ? await response.json() : null
    return isValidLicense(value)
      ? { status: 'ready', authorizationId: value.authorizationId, notice: value.notice }
      : { status: 'error' }
  } catch {
    return { status: 'error' }
  }
}
