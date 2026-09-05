import { useEffect, useState } from 'react'
import './PwaUpdateNotice.css'

interface PwaStatusNoticeProps {
  offlineReady: boolean
  updateAvailable: boolean
  onClose: () => void
  onUpdate: () => void
}

export function PwaStatusNotice({
  offlineReady,
  updateAvailable,
  onClose,
  onUpdate,
}: PwaStatusNoticeProps) {
  if (!offlineReady && !updateAvailable) {
    return null
  }

  if (updateAvailable) {
    return (
      <aside aria-label="应用更新提示" className="pwa-notice pwa-notice-update">
        <div>
          <strong>发现新版本</strong>
          <p>更新后可获得最新题库和功能。</p>
        </div>
        <div className="pwa-notice-actions">
          <button className="pwa-secondary-button" onClick={onClose} type="button">稍后更新</button>
          <button onClick={onUpdate} type="button">立即更新</button>
        </div>
      </aside>
    )
  }

  return (
    <aside aria-label="离线就绪提示" className="pwa-notice">
      <div>
        <strong>已可离线使用</strong>
        <p>已打开过的题库和本机学习记录在断网时仍可使用。</p>
      </div>
      <button className="pwa-secondary-button" onClick={onClose} type="button">关闭提示</button>
    </aside>
  )
}

export function PwaUpdateNotice() {
  const [offlineReady, setOfflineReady] = useState(false)
  const [needRefresh, setNeedRefresh] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
      return undefined
    }

    let isDisposed = false

    function observeInstallingWorker(worker: ServiceWorker) {
      worker.addEventListener('statechange', () => {
        if (isDisposed || worker.state !== 'installed') {
          return
        }

        if (navigator.serviceWorker.controller) {
          setNeedRefresh(true)
        } else {
          setOfflineReady(true)
        }
      })
    }

    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then((registered) => {
      if (registered.waiting) {
        setNeedRefresh(true)
      }
      if (registered.installing) {
        observeInstallingWorker(registered.installing)
      }
      registered.addEventListener('updatefound', () => {
        if (registered.installing) {
          observeInstallingWorker(registered.installing)
        }
      })
    })

    return () => {
      isDisposed = true
    }
  }, [])

  async function updateServiceWorker() {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration?.waiting) {
      window.location.reload()
      return
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true })
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  return (
    <PwaStatusNotice
      offlineReady={offlineReady}
      onClose={() => {
        setOfflineReady(false)
        setNeedRefresh(false)
      }}
      onUpdate={() => void updateServiceWorker()}
      updateAvailable={needRefresh}
    />
  )
}
