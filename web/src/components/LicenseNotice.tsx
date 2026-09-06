import type { LicenseState } from '../license/license'
import './LicenseNotice.css'

export interface LicenseNoticeProps {
  state: LicenseState
}

export function LicenseNotice({ state }: LicenseNoticeProps) {
  if (state.status === 'error') {
    return <p className="license-notice license-notice-error" role="alert">授权信息加载失败，请联系卖家</p>
  }

  return (
    <aside aria-label="授权信息" className="license-notice">
      <strong>授权编号：{state.authorizationId}</strong>
      <span>{state.notice}</span>
    </aside>
  )
}
