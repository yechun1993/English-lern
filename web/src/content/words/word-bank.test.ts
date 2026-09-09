import { describe, expect, it } from 'vitest'
import { getWordAudioPath, toWordId } from '../../domain/word'
import { wordBank } from './word-bank'

describe('wordBank', () => {
  it('preserves the supplied 1,911-word source order and stable IDs', () => {
    expect(wordBank).toHaveLength(1911)
    expect(wordBank[0]).toMatchObject({ id: 'word-0001', index: 1, word: 'ability' })
    expect(wordBank.at(-1)).toMatchObject({ id: 'word-1911', index: 1911, word: 'zero' })
    expect(new Set(wordBank.map((entry) => entry.word)).size).toBe(1911)
  })

  it('keeps known blank phonetics learnable and maps every index to a local MP3', () => {
    expect(wordBank.find((entry) => entry.word === 'ought to')).toMatchObject({ phonetic: null })
    expect(toWordId(1)).toBe('word-0001')
    expect(getWordAudioPath(1)).toBe('/audio/words/0001.mp3')
    expect(getWordAudioPath(1911)).toBe('/audio/words/1911.mp3')
    expect(new Set(wordBank.map((entry) => getWordAudioPath(entry.index))).size).toBe(1911)
  })
})
