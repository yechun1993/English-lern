import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const expectedHeader = '#,单词,音标,解释,笔记'
const moduleDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(moduleDirectory, '..', '..')

function fail(message) {
  throw new Error(`词表校验失败：${message}`)
}

function toWordId(index) {
  return `word-${String(index).padStart(4, '0')}`
}

function parseCsvLine(line, lineNumber) {
  const columns = []
  let value = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"'
        index += 1
      } else {
        quoted = !quoted
      }
      continue
    }
    if (character === ',' && !quoted) {
      columns.push(value)
      value = ''
      continue
    }
    value += character
  }

  if (quoted) {
    fail(`第 ${lineNumber} 行引号未闭合。`)
  }
  columns.push(value)
  return columns
}

function parseEntry(line, lineNumber, seenWords) {
  const columns = parseCsvLine(line, lineNumber)
  if (columns.length !== 5) {
    fail(`第 ${lineNumber} 行应包含 5 列。`)
  }

  const [sourceIndex, word, phonetic, meaning, note] = columns
  const expectedIndex = lineNumber - 1
  if (!/^\d+$/.test(sourceIndex) || Number(sourceIndex) !== expectedIndex) {
    fail(`第 ${lineNumber} 行序号应为 ${expectedIndex}。`)
  }
  if (!word.trim()) {
    fail(`第 ${lineNumber} 行单词不能为空。`)
  }
  if (!meaning.trim()) {
    fail(`第 ${lineNumber} 行释义不能为空。`)
  }

  const normalizedWord = word.toLowerCase()
  if (seenWords.has(normalizedWord)) {
    fail(`重复单词：${word}。`)
  }
  seenWords.add(normalizedWord)

  const index = Number(sourceIndex)
  return {
    id: toWordId(index),
    index,
    word,
    phonetic: phonetic || null,
    meaning,
    note: note || null,
  }
}

function renderWordModule(entries) {
  return [
    "import type { WordEntry } from '../../domain/word'",
    '',
    `export const wordBank: readonly WordEntry[] = ${JSON.stringify(entries, null, 2)}`,
    '',
  ].join('\n')
}

export async function generateWordBank({ inputPath, outputModulePath, outputAudioManifestPath }) {
  const source = (await readFile(inputPath, 'utf8')).replace(/^\uFEFF/, '').trimEnd()
  const lines = source.split(/\r?\n/)
  if (lines.shift() !== expectedHeader) {
    fail('CSV 表头不匹配。')
  }

  const seenWords = new Set()
  const entries = lines.map((line, index) => parseEntry(line, index + 2, seenWords))
  if (entries.length === 0) {
    fail('词表不能为空。')
  }

  await mkdir(dirname(outputModulePath), { recursive: true })
  await mkdir(dirname(outputAudioManifestPath), { recursive: true })
  await writeFile(outputModulePath, renderWordModule(entries), 'utf8')
  await writeFile(outputAudioManifestPath, `${JSON.stringify(entries.map((entry) => ({
    id: entry.id,
    index: entry.index,
    word: entry.word,
    fileName: `${String(entry.index).padStart(4, '0')}.mp3`,
  })), null, 2)}\n`, 'utf8')

  return {
    entryCount: entries.length,
    firstWord: entries[0].word,
    lastWord: entries.at(-1).word,
  }
}

async function main() {
  const result = await generateWordBank({
    inputPath: join(moduleDirectory, '2000.csv'),
    outputModulePath: join(projectRoot, 'web', 'src', 'content', 'words', 'word-bank.ts'),
    outputAudioManifestPath: join(projectRoot, 'tools', 'audio', 'word-audio-manifest.json'),
  })
  console.log(`词表生成完成：${result.entryCount} 个单词。`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : '词表生成失败。')
    process.exitCode = 1
  })
}
