import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { verifyWordAudio } from './verify-word-audio.mjs'

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), 'szu-word-audio-'))
  const audioDirectory = join(root, 'audio')
  const manifestPath = join(root, 'manifest.json')
  await mkdir(audioDirectory)
  await writeFile(manifestPath, JSON.stringify([
    { id: 'word-0001', index: 1, word: 'ability', fileName: '0001.mp3' },
    { id: 'word-0002', index: 2, word: 'able', fileName: '0002.mp3' },
  ]))
  return { root, audioDirectory, manifestPath }
}

async function writeInventory(directory, files) {
  await Promise.all(files.map((fileName) => writeFile(join(directory, fileName), `audio:${fileName}`)))
}

test('rejects a missing manifest audio file', async () => {
  const fixture = await createFixture()
  try {
    await writeInventory(fixture.audioDirectory, ['0001.mp3'])
    await assert.rejects(
      verifyWordAudio({ ...fixture, run: async () => ({}) }),
      /缺少 0002\.mp3/,
    )
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('rejects an unregistered MP3 file', async () => {
  const fixture = await createFixture()
  try {
    await writeInventory(fixture.audioDirectory, ['0001.mp3', '0002.mp3', '9999.mp3'])
    await assert.rejects(
      verifyWordAudio({ ...fixture, run: async () => ({}) }),
      /发现未登记的音频文件：9999\.mp3/,
    )
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('verifies every exact nonempty MP3 through FFmpeg', async () => {
  const fixture = await createFixture()
  const runCalls = []
  try {
    await writeInventory(fixture.audioDirectory, ['0001.mp3', '0002.mp3'])
    const result = await verifyWordAudio({
      ...fixture,
      run: async (command, args) => {
        runCalls.push([command, args])
        return { stdout: '', stderr: '' }
      },
    })

    assert.deepEqual(result, { expectedCount: 2, verifiedCount: 2 })
    assert.equal(runCalls.filter(([command]) => command === 'ffmpeg').length, 2)
    assert.deepEqual(runCalls[0][1].slice(0, 3), ['-v', 'error', '-i'])
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('rejects duplicate manifest filenames and zero-byte audio', async () => {
  const fixture = await createFixture()
  try {
    await writeFile(fixture.manifestPath, JSON.stringify([
      { id: 'word-0001', index: 1, word: 'ability', fileName: '0001.mp3' },
      { id: 'word-0002', index: 2, word: 'able', fileName: '0001.mp3' },
    ]))
    await writeFile(join(fixture.audioDirectory, '0001.mp3'), '')
    await assert.rejects(
      verifyWordAudio({ ...fixture, run: async () => ({}) }),
      /音频清单包含重复文件名：0001\.mp3/,
    )

    await writeFile(fixture.manifestPath, JSON.stringify([
      { id: 'word-0001', index: 1, word: 'ability', fileName: '0001.mp3' },
    ]))
    await assert.rejects(
      verifyWordAudio({ ...fixture, run: async () => ({}) }),
      /音频文件为空：0001\.mp3/,
    )
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})
