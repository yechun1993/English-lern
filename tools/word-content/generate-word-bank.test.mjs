import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateWordBank } from './generate-word-bank.mjs'

const header = '#,单词,音标,解释,笔记'

async function withFixture(source, assertion) {
  const directory = await mkdtemp(join(tmpdir(), 'szu-word-bank-'))
  const inputPath = join(directory, 'source.csv')
  const outputModulePath = join(directory, 'word-bank.ts')
  const outputAudioManifestPath = join(directory, 'word-audio-manifest.json')

  await writeFile(inputPath, source, 'utf8')

  try {
    await assertion({ inputPath, outputModulePath, outputAudioManifestPath })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('generates a typed word module and audio manifest from a valid CSV', async () => {
  await withFixture(`${header}\n1,ability,美:/əˈbɪləti/,n. 能力，能耐；才能,\n2,able,美:/'ebl/,adj. 能干的；有能力的；能,\n`, async (paths) => {
    const result = await generateWordBank(paths)

    assert.deepEqual(result, { entryCount: 2, firstWord: 'ability', lastWord: 'able' })
    assert.match(await readFile(paths.outputModulePath, 'utf8'), /"id": "word-0001"/)
    assert.deepEqual(JSON.parse(await readFile(paths.outputAudioManifestPath, 'utf8')), [
      { id: 'word-0001', index: 1, word: 'ability', fileName: '0001.mp3' },
      { id: 'word-0002', index: 2, word: 'able', fileName: '0002.mp3' },
    ])
  })
})

test('preserves commas that appear inside quoted phonetics and meanings', async () => {
  await withFixture(`${header}\n1,address,"英:/əˈdres/ 美:/əˈdres , ˈædres/","v. 写信, 演讲",\n`, async (paths) => {
    await generateWordBank(paths)

    const output = await readFile(paths.outputModulePath, 'utf8')
    assert.match(output, /英:\/əˈdres\/ 美:\/əˈdres , ˈædres\//)
    assert.match(output, /v\. 写信, 演讲/)
  })
})

test('rejects a duplicate word without ignoring letter case', async () => {
  await withFixture(`${header}\n1,ability,美:/a/,能力,\n2,Ability,美:/b/,能力,\n`, async (paths) => {
    await assert.rejects(() => generateWordBank(paths), /词表校验失败：重复单词/) 
  })
})

test('rejects a nonconsecutive source index', async () => {
  await withFixture(`${header}\n1,ability,美:/a/,能力,\n3,able,美:/b/,能干的,\n`, async (paths) => {
    await assert.rejects(() => generateWordBank(paths), /词表校验失败：第 3 行序号应为 2/) 
  })
})

test('rejects a row without an English word or Chinese meaning', async () => {
  await withFixture(`${header}\n1,,美:/a/,能力,\n`, async (paths) => {
    await assert.rejects(() => generateWordBank(paths), /词表校验失败：第 2 行单词不能为空/) 
  })

  await withFixture(`${header}\n1,ability,美:/a/,,\n`, async (paths) => {
    await assert.rejects(() => generateWordBank(paths), /词表校验失败：第 2 行释义不能为空/) 
  })
})

test('rejects rows that do not contain the five expected CSV columns', async () => {
  await withFixture(`${header}\n1,ability,美:/a/,能力,,extra\n`, async (paths) => {
    await assert.rejects(() => generateWordBank(paths), /词表校验失败：第 2 行应包含 5 列/) 
  })
})
