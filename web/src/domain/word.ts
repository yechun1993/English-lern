export interface WordEntry {
  id: string
  index: number
  word: string
  phonetic: string | null
  meaning: string
  note: string | null
}

export type WordBrowseMode = 'ordered' | 'initial' | 'random' | 'mastered'

export function toWordId(index: number): string {
  return `word-${String(index).padStart(4, '0')}`
}

export function getWordAudioPath(index: number): string {
  return `/audio/words/${String(index).padStart(4, '0')}.mp3`
}
