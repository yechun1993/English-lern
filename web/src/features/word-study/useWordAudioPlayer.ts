import { useEffect, useRef, useState, type RefObject } from 'react'
import type { WordEntry } from '../../domain/word'
import { createWordAudioPlayer, type WordAudioPlayer, type WordAudioStatus } from './word-audio-player'

export function useWordAudioPlayer(
  audioRef: RefObject<HTMLAudioElement | null>,
  preloadWords: readonly WordEntry[],
) {
  const [status, setStatus] = useState<WordAudioStatus>({ phase: 'idle', wordId: null })
  const controllerRef = useRef<WordAudioPlayer | null>(null)

  useEffect(() => {
    if (!audioRef.current) return
    const controller = createWordAudioPlayer({
      audio: audioRef.current,
      fetchAudio: async (url, signal) => {
        const response = await fetch(url, { signal })
        if (!response.ok) throw new Error(`audio ${response.status}`)
        return response.blob()
      },
      createObjectURL: URL.createObjectURL,
      revokeObjectURL: URL.revokeObjectURL,
      onStatus: setStatus,
    })
    controllerRef.current = controller
    void controller.preload(preloadWords)
    return () => {
      controller.dispose()
      controllerRef.current = null
    }
  }, [audioRef, preloadWords])

  return { status, play: (word: WordEntry) => controllerRef.current?.play(word) }
}
