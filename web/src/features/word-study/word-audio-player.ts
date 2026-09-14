import { getWordAudioPath, type WordEntry } from '../../domain/word'

export type WordAudioStatus =
  | { phase: 'idle'; wordId: null }
  | { phase: 'loading' | 'playing'; wordId: string }
  | { phase: 'error'; wordId: string; message: '播放失败，请再次点击' }

export interface WordAudioPlayer {
  preload(words: readonly WordEntry[]): Promise<void>
  play(word: WordEntry): void
  dispose(): void
}

interface AudioElementLike {
  src: string
  currentTime: number
  pause(): void
  load(): void
  play(): Promise<void>
  addEventListener(type: 'playing' | 'error' | 'ended', listener: () => void): void
  removeEventListener(type: 'playing' | 'error' | 'ended', listener: () => void): void
}

interface WordAudioPlayerDependencies {
  audio: AudioElementLike
  fetchAudio: (url: string, signal: AbortSignal) => Promise<Blob>
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
  onStatus: (status: WordAudioStatus) => void
}

export function createWordAudioPlayer({
  audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus,
}: WordAudioPlayerDependencies): WordAudioPlayer {
  const abortController = new AbortController()
  const blobUrls = new Map<string, string>()
  const queuedIds = new Set<string>()
  const queue: WordEntry[] = []
  const workers = new Set<Promise<void>>()
  let disposed = false
  let activeToken = 0
  let activeListeners: Partial<Record<'playing' | 'error' | 'ended', () => void>> = {}

  async function work() {
    while (!disposed && queue.length > 0) {
      const word = queue.shift()!
      try {
        const blob = await fetchAudio(getWordAudioPath(word.index), abortController.signal)
        if (disposed) continue
        const url = createObjectURL(blob)
        if (disposed) revokeObjectURL(url)
        else blobUrls.set(word.id, url)
      } catch {
        // Preloading is optional; play can always try the local MP3 directly.
      } finally {
        queuedIds.delete(word.id)
      }
    }
  }

  async function preload(words: readonly WordEntry[]) {
    if (disposed) return
    for (const word of words) {
      if (blobUrls.has(word.id) || queuedIds.has(word.id)) continue
      queuedIds.add(word.id)
      queue.push(word)
    }
    do {
      const workerCount = Math.min(4 - workers.size, queue.length)
      for (let index = 0; index < workerCount; index += 1) {
        const worker = work().finally(() => { workers.delete(worker) })
        workers.add(worker)
      }
      await Promise.all(workers)
      // A concurrent call may enqueue work while completed workers are settling.
    } while (!disposed && queue.length > 0)
  }

  function clearActiveListeners() {
    for (const type of ['playing', 'error', 'ended'] as const) {
      const listener = activeListeners[type]
      if (listener) audio.removeEventListener(type, listener)
    }
    activeListeners = {}
  }

  function installLatestOnlyListeners(token: number, wordId: string) {
    const report = (status: WordAudioStatus) => {
      if (token === activeToken) onStatus(status)
    }
    activeListeners = {
      playing: () => report({ phase: 'playing', wordId }),
      error: () => report({ phase: 'error', wordId, message: '播放失败，请再次点击' }),
      ended: () => report({ phase: 'idle', wordId: null }),
    }
    for (const type of ['playing', 'error', 'ended'] as const) {
      audio.addEventListener(type, activeListeners[type]!)
    }
  }

  function play(word: WordEntry) {
    if (disposed) return
    const token = ++activeToken
    clearActiveListeners()
    audio.pause()
    audio.src = blobUrls.get(word.id) ?? getWordAudioPath(word.index)
    audio.currentTime = 0
    onStatus({ phase: 'loading', wordId: word.id })
    installLatestOnlyListeners(token, word.id)
    audio.load()
    const reportFailure = () => {
      if (token === activeToken) {
        onStatus({ phase: 'error', wordId: word.id, message: '播放失败，请再次点击' })
      }
    }
    try {
      void audio.play().catch(reportFailure)
    } catch {
      reportFailure()
    }
  }

  function dispose() {
    if (disposed) return
    disposed = true
    activeToken += 1
    clearActiveListeners()
    abortController.abort()
    queue.length = 0
    queuedIds.clear()
    audio.pause()
    audio.src = ''
    audio.load()
    for (const url of blobUrls.values()) revokeObjectURL(url)
    blobUrls.clear()
    onStatus({ phase: 'idle', wordId: null })
  }

  return { preload, play, dispose }
}
