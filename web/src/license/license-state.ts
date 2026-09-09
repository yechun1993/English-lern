import type { LicenseState } from './license'

export function applyLicenseState(current: LicenseState, next: LicenseState): LicenseState {
  if (current.status !== next.status) {
    return next
  }

  if (current.status === 'error' || next.status === 'error') {
    return current
  }

  return current.authorizationId === next.authorizationId && current.notice === next.notice
    ? current
    : next
}
