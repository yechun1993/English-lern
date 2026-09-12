import { spawn } from 'node:child_process'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const moduleDirectory = dirname(fileURLToPath(import.meta.url))
const defaultManifestPath = join(moduleDirectory, 'word-audio-manifest.json')
const defaultAudioDirectory = resolve(moduleDirectory, '..', '..', 'web', 'public', 'audio', 'words')

function defaultRun(command, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { shell: false, windowsHide: true })
    let stderr = ''
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.once('error', rejectRun)
    child.once('close', (code) => {
      if (code === 0) {
        resolveRun({ stdout: '', stderr })
        return
      }
      rejectRun(new Error(`${command} 执行失败（退出代码 ${code ?? '未知'}）。${stderr}`))
    })
  })
}

async function runWithConcurrency(items, limit, action) {
  let nextIndex = 0
  async function worker() {
    while (nextIndex < items.length) {
      const item = items[nextIndex]
      nextIndex += 1
      await action(item)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
}

function parseManifest(raw) {
  let manifest
  try {
    manifest = JSON.parse(raw)
  } catch {
    throw new Error('音频清单不是有效的 JSON。')
  }

  if (!Array.isArray(manifest) || manifest.length === 0) {
    throw new Error('音频清单为空或格式无效。')
  }

  const filenames = []
  const seen = new Set()
  for (const entry of manifest) {
    const fileName = entry?.fileName
    if (typeof fileName !== 'string' || !/^\d{4}\.mp3$/.test(fileName)) {
      throw new Error('音频清单包含无效文件名。')
    }
    if (seen.has(fileName)) {
      throw new Error(`音频清单包含重复文件名：${fileName}`)
    }
    seen.add(fileName)
    filenames.push(fileName)
  }
  return filenames
}

export async function verifyWordAudio({
  manifestPath = defaultManifestPath,
  audioDirectory = defaultAudioDirectory,
  run = defaultRun,
} = {}) {
  const expectedFiles = parseManifest(await readFile(manifestPath, 'utf8'))
  const expectedSet = new Set(expectedFiles)
  const directoryEntries = await readdir(audioDirectory, { withFileTypes: true })
  const actualMp3Files = directoryEntries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.mp3'))
    .map((entry) => entry.name)

  for (const fileName of expectedFiles) {
    if (!actualMp3Files.includes(fileName)) {
      throw new Error(`缺少 ${fileName}`)
    }
  }

  const extraFiles = actualMp3Files.filter((fileName) => !expectedSet.has(fileName)).sort()
  if (extraFiles.length > 0) {
    throw new Error(`发现未登记的音频文件：${extraFiles.join('、')}`)
  }

  await runWithConcurrency(expectedFiles, 8, async (fileName) => {
    const filePath = join(audioDirectory, fileName)
    if ((await stat(filePath)).size === 0) {
      throw new Error(`音频文件为空：${fileName}`)
    }
    await run('ffmpeg', ['-v', 'error', '-i', filePath, '-f', 'null', '-'])
  })

  return { expectedCount: expectedFiles.length, verifiedCount: expectedFiles.length }
}

async function runCli() {
  const result = await verifyWordAudio()
  console.log(JSON.stringify(result))
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : '音频验证失败。')
    process.exitCode = 1
  })
}
