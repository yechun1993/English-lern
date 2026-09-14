import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { WordEntry } from '../../domain/word'
import { createWordAudioPlayer, type WordAudioStatus } from './word-audio-player'
import { useWordAudioPlayer } from './useWordAudioPlayer'

type AudioListener = () => void

class FakeAudio {
  src = ''
  currentTime = 0
  private listeners = new Map<string, Set<AudioListener>>()
  pause = vi.fn()
  load = vi.fn()
  play = vi.fn<() => Promise<void>>(() => Promise.resolve())

  addEventListener(type: string, listener: AudioListener) {
    const listeners = this.listeners.get(type) ?? new Set<AudioListener>()
    listeners.add(listener)
    this.listeners.set(type, listeners)
  }

  removeEventListener(type: string, listener: AudioListener) {
    this.listeners.get(type)?.delete(listener)
  }

  dispatch(type: string) {
    this.listeners.get(type)?.forEach((listener) => listener())
  }

  capture(type: string) {
    return [...(this.listeners.get(type) ?? [])]
  }
}

const words: WordEntry[] = [
  { id: 'word-0001', index: 1, word: 'ability', phonetic: null, meaning: '能力', note: null },
  { id: 'word-0002', index: 2, word: 'able', phonetic: null, meaning: '能够', note: null },
]

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

let audio: FakeAudio
let fetchAudio: ReturnType<typeof vi.fn<(url: string, signal: AbortSignal) => Promise<Blob>>>
let createObjectURL: ReturnType<typeof vi.fn<(blob: Blob) => string>>
let revokeObjectURL: ReturnType<typeof vi.fn<(url: string) => void>>
let onStatus: ReturnType<typeof vi.fn<(status: WordAudioStatus) => void>>

beforeEach(() => {
  audio = new FakeAudio()
  fetchAudio = vi.fn(async (url: string) => new Blob([url], { type: 'audio/mpeg' }))
  createObjectURL = vi.fn((blob: Blob) => blob.size > 0
    ? `blob:word-${createObjectURL.mock.calls.length.toString().padStart(4, '0')}`
    : 'blob:empty')
  revokeObjectURL = vi.fn()
  onStatus = vi.fn()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function createPlayer() {
  return createWordAudioPlayer({ audio, fetchAudio, createObjectURL, revokeObjectURL, onStatus })
}

describe('word audio controller', () => {
  it('preloads both local files and reuses their blob URLs', async () => {
    const player = createPlayer()
    await player.preload(words)
    expect(fetchAudio.mock.calls.map(([url]) => url)).toEqual([
      '/audio/words/0001.mp3', '/audio/words/0002.mp3',
    ])
    player.play(words[0])
    expect(audio.src).toBe('blob:word-0001')
    expect(audio.load).toHaveBeenCalledOnce()
    expect(audio.play).toHaveBeenCalledOnce()
    player.play(words[1])
    expect(audio.src).toBe('blob:word-0002')
    expect(createObjectURL).toHaveBeenCalledTimes(2)
  })

  it('bounds concurrent fetches to four across overlapping preloads and deduplicates IDs', async () => {
    const batch = Array.from({ length: 10 }, (_, index) => ({
      ...words[0], id: `word-${String(index + 1).padStart(4, '0')}`, index: index + 1,
    }))
    const gates = batch.map(() => deferred<Blob>())
    let active = 0
    let maximum = 0
    fetchAudio.mockImplementation(async (url) => {
      active += 1
      maximum = Math.max(maximum, active)
      const index = Number(url.match(/(\d+)\.mp3$/)![1]) - 1
      try { return await gates[index].promise } finally { active -= 1 }
    })
    const player = createPlayer()
    const first = player.preload([...batch.slice(0, 6), batch[0]])
    const second = player.preload(batch)
    expect(fetchAudio).toHaveBeenCalledTimes(4)
    gates.forEach((gate) => gate.resolve(new Blob(['audio'])))
    await Promise.all([first, second])
    await player.preload(batch)
    expect(maximum).toBe(4)
    expect(active).toBe(0)
    expect(fetchAudio).toHaveBeenCalledTimes(10)
    expect(createObjectURL).toHaveBeenCalledTimes(10)
    await player.preload([])
    expect(fetchAudio).toHaveBeenCalledTimes(10)
  })

  it('plays an uncached local URL synchronously while preload is pending', async () => {
    const gate = deferred<Blob>()
    fetchAudio.mockReturnValue(gate.promise)
    const player = createPlayer()
    const preload = player.preload(words)
    player.play(words[0])
    expect(audio.src).toBe('/audio/words/0001.mp3')
    expect(audio.play).toHaveBeenCalledOnce()
    expect(onStatus).toHaveBeenLastCalledWith({ phase: 'loading', wordId: 'word-0001' })
    gate.resolve(new Blob(['audio']))
    await preload
    expect(audio.src).toBe('/audio/words/0001.mp3')
    expect(audio.play).toHaveBeenCalledOnce()
  })

  it.each(['fetch', 'blob'] as const)('silently falls back to local audio when %s creation fails', async (failure) => {
    if (failure === 'fetch') fetchAudio.mockRejectedValue(new Error('network'))
    else createObjectURL.mockImplementation(() => { throw new Error('blob unavailable') })
    const player = createPlayer()
    await expect(player.preload(words)).resolves.toBeUndefined()
    expect(onStatus).not.toHaveBeenCalled()
    player.play(words[0])
    expect(audio.src).toBe('/audio/words/0001.mp3')
    expect(audio.play).toHaveBeenCalledOnce()
  })

  it('retries a failed preload on a later call', async () => {
    fetchAudio.mockRejectedValueOnce(new Error('offline'))
    const player = createPlayer()
    await player.preload([words[0]])
    await player.preload([words[0]])
    player.play(words[0])
    expect(fetchAudio).toHaveBeenCalledTimes(2)
    expect(audio.src).toBe('blob:word-0001')
  })

  it('pauses the old source, then resets and loads the new source before playing', () => {
    const player = createPlayer()
    player.play(words[0])
    audio.currentTime = 12
    const steps: string[] = []
    audio.pause.mockImplementation(() => {
      expect(audio.src).toBe('/audio/words/0001.mp3')
      steps.push('pause')
    })
    audio.load.mockImplementation(() => {
      expect(audio.src).toBe('/audio/words/0002.mp3')
      expect(audio.currentTime).toBe(0)
      steps.push('load')
    })
    audio.play.mockImplementation(async () => { steps.push('play') })
    player.play(words[1])
    expect(steps).toEqual(['pause', 'load', 'play'])
  })

  it('allows only the latest click to publish events or a rejected play promise', async () => {
    const firstPlay = deferred<void>()
    audio.play.mockReturnValueOnce(firstPlay.promise).mockResolvedValueOnce()
    const player = createPlayer()
    player.play(words[0])
    const staleListeners = ['playing', 'error', 'ended'].flatMap((type) => audio.capture(type))
    player.play(words[1])
    onStatus.mockClear()
    firstPlay.reject(new Error('interrupted'))
    await Promise.resolve()
    staleListeners.forEach((listener) => listener())
    expect(onStatus).not.toHaveBeenCalled()
    for (const type of ['playing', 'error', 'ended']) expect(audio.capture(type)).toHaveLength(1)
    audio.dispatch('playing')
    expect(onStatus).toHaveBeenLastCalledWith({ phase: 'playing', wordId: 'word-0002' })
    audio.dispatch('error')
    expect(onStatus).toHaveBeenLastCalledWith({
      phase: 'error', wordId: 'word-0002', message: '播放失败，请再次点击',
    })
    audio.dispatch('ended')
    expect(onStatus).toHaveBeenLastCalledWith({ phase: 'idle', wordId: null })
  })

  it('reports the exact failure when the active play promise rejects', async () => {
    audio.play.mockRejectedValueOnce(new Error('denied'))
    const player = createPlayer()
    player.play(words[0])
    await Promise.resolve()
    expect(onStatus).toHaveBeenLastCalledWith({
      phase: 'error', wordId: 'word-0001', message: '播放失败，请再次点击',
    })
  })

  it('disposes once, clears audio and listeners, revokes every blob, and ignores subsequent calls', async () => {
    const player = createPlayer()
    await player.preload(words)
    const pendingPlay = deferred<void>()
    audio.play.mockReturnValueOnce(pendingPlay.promise)
    player.play(words[0])
    const staleListeners = ['playing', 'error', 'ended'].flatMap((type) => audio.capture(type))
    const signal = fetchAudio.mock.calls[0][1]
    audio.pause.mockClear()
    audio.load.mockClear()
    audio.play.mockClear()
    onStatus.mockClear()
    player.dispose()
    expect(signal.aborted).toBe(true)
    expect(audio.src).toBe('')
    expect(audio.pause).toHaveBeenCalledOnce()
    expect(audio.load).toHaveBeenCalledOnce()
    expect(revokeObjectURL.mock.calls).toEqual([['blob:word-0001'], ['blob:word-0002']])
    for (const type of ['playing', 'error', 'ended']) expect(audio.capture(type)).toHaveLength(0)
    player.dispose()
    player.play(words[1])
    await player.preload(words)
    pendingPlay.reject(new Error('disposed'))
    await Promise.resolve()
    staleListeners.forEach((listener) => listener())
    expect(audio.pause).toHaveBeenCalledOnce()
    expect(audio.load).toHaveBeenCalledOnce()
    expect(audio.play).not.toHaveBeenCalled()
    expect(fetchAudio).toHaveBeenCalledTimes(2)
    expect(revokeObjectURL).toHaveBeenCalledTimes(2)
    expect(onStatus.mock.calls).toEqual([[{ phase: 'idle', wordId: null }]])
  })

  it('does not allocate blobs for fetches that finish after disposal or start queued requests', async () => {
    const gate = deferred<Blob>()
    fetchAudio.mockReturnValue(gate.promise)
    const player = createPlayer()
    const batch = Array.from({ length: 6 }, (_, index) => ({ ...words[0], id: `word-${index}`, index: index + 1 }))
    const preload = player.preload(batch)
    player.dispose()
    gate.resolve(new Blob(['late']))
    await preload
    expect(fetchAudio).toHaveBeenCalledTimes(4)
    expect(fetchAudio.mock.calls.every(([, signal]) => signal.aborted)).toBe(true)
    expect(createObjectURL).not.toHaveBeenCalled()
    expect(onStatus.mock.calls).toEqual([[{ phase: 'idle', wordId: null }]])
  })

  it('revokes a just-created blob if disposal happens during URL creation', async () => {
    const player = createPlayer()
    createObjectURL.mockImplementationOnce(() => {
      player.dispose()
      return 'blob:late'
    })
    await player.preload(words)
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:late')
    expect(createObjectURL).toHaveBeenCalledOnce()
  })

  it('swallows aborted fetch rejections', async () => {
    fetchAudio.mockImplementation((_url, signal) => new Promise<Blob>((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true })
    }))
    const player = createPlayer()
    const preload = player.preload(words)
    player.dispose()
    await expect(preload).resolves.toBeUndefined()
    expect(createObjectURL).not.toHaveBeenCalled()
  })
})

describe('useWordAudioPlayer', () => {
  it('keeps the controller on ordinary renders and disposes it when the batch changes or unmounts', async () => {
    const browserFetch = vi.fn(async () => ({ ok: true, blob: async () => new Blob(['audio']) }))
    vi.stubGlobal('fetch', browserFetch)
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    const audioRef = { current: audio as unknown as HTMLAudioElement }
    const hook = renderHook(({ batch }) => useWordAudioPlayer(audioRef, batch), { initialProps: { batch: words } })
    await act(async () => {})
    expect(browserFetch).toHaveBeenCalledTimes(2)
    act(() => hook.result.current.play(words[0]))
    expect(hook.result.current.status).toEqual({ phase: 'loading', wordId: 'word-0001' })
    act(() => audio.dispatch('playing'))
    hook.rerender({ batch: words })
    expect(hook.result.current.status).toEqual({ phase: 'playing', wordId: 'word-0001' })
    expect(revokeObjectURL).not.toHaveBeenCalled()
    expect(browserFetch).toHaveBeenCalledTimes(2)
    hook.rerender({ batch: [words[1]] })
    await act(async () => {})
    expect(revokeObjectURL).toHaveBeenCalledTimes(2)
    expect(browserFetch).toHaveBeenCalledTimes(3)
    expect(hook.result.current.status).toEqual({ phase: 'idle', wordId: null })
    act(() => hook.result.current.play(words[1]))
    expect(audio.src).toBe('blob:word-0003')
    hook.unmount()
    expect(revokeObjectURL).toHaveBeenCalledTimes(3)
    expect(audio.src).toBe('')
  })

  it('falls back on HTTP preload failure and tolerates a missing audio ref', async () => {
    const browserFetch = vi.fn(async () => ({ ok: false, status: 404 }))
    vi.stubGlobal('fetch', browserFetch)
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    const missing = renderHook(() => useWordAudioPlayer({ current: null }, words))
    act(() => missing.result.current.play(words[0]))
    expect(missing.result.current.status).toEqual({ phase: 'idle', wordId: null })
    expect(browserFetch).not.toHaveBeenCalled()
    missing.unmount()
    const audioRef = { current: audio as unknown as HTMLAudioElement }
    const hook = renderHook(() => useWordAudioPlayer(audioRef, words))
    await act(async () => {})
    act(() => hook.result.current.play(words[0]))
    expect(audio.src).toBe('/audio/words/0001.mp3')
    expect(createObjectURL).not.toHaveBeenCalled()
    hook.unmount()
  })
})
