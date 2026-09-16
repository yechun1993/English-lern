import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { verifyWordAudio } from '../audio/verify-word-audio.mjs'

const releaseVersion = '1.2.0'
const packageDirectoryName = `深大学位英语题库_公开版_v${releaseVersion}`
const archiveFileName = `${packageDirectoryName}.zip`
const moduleDirectory = dirname(fileURLToPath(import.meta.url))
const defaultProjectRoot = resolve(moduleDirectory, '..', '..')
const defaultAudioLicensePath = join(defaultProjectRoot, 'tools', 'audio', 'KOKORO-82M-APACHE-2.0.txt')
const defaultAudioAttributionPath = join(defaultProjectRoot, 'tools', 'audio', 'ATTRIBUTION.md')
const defaultAudioManifestPath = join(defaultProjectRoot, 'tools', 'audio', 'word-audio-manifest.json')

function publicUsageGuide() {
  return `使用说明

1. 解压本文件到任意本地文件夹。
2. 双击“启动学位英语题库.cmd”，并保持弹出的窗口打开。
3. 浏览器会自动打开公开学习版；同一可信 Wi-Fi 下的平板可访问窗口显示的局域网地址。
4. 学习记录、错题和草稿只保存在当前浏览器；请勿在公共 Wi-Fi 上开放局域网地址。
5. 单词速记的美式发音已内置，可离线播放。
`
}

function defaultRun(command, args, { cwd }) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { cwd, shell: false, windowsHide: true })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk) => { stdout += chunk })
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.once('error', rejectRun)
    child.once('close', (code) => {
      if (code === 0) {
        resolveRun({ stdout, stderr })
        return
      }
      rejectRun(new Error(`${command} 执行失败（退出代码 ${code ?? '未知'}）。${stderr}`))
    })
  })
}

function findSevenZip(explicitPath) {
  const candidates = [
    explicitPath,
    process.env.SEVEN_ZIP_PATH,
    'C:\\Program Files\\7-Zip\\7z.exe',
    'C:\\Program Files (x86)\\7-Zip\\7z.exe',
  ].filter((candidate) => typeof candidate === 'string' && candidate.length > 0)

  const sevenZipPath = candidates.find((candidate) => existsSync(candidate))
  if (!sevenZipPath) {
    throw new Error('未找到 7-Zip 命令行工具。请安装 7-Zip 后重试。')
  }
  return sevenZipPath
}

async function sha256File(filePath) {
  const content = await readFile(filePath)
  return createHash('sha256').update(content).digest('hex')
}

export async function stagePublicRelease({
  buildDirectory,
  outputRoot,
  nodePath = process.execPath,
  serverSourcePath = join(moduleDirectory, 'server.mjs'),
  launcherTemplatePath = join(defaultProjectRoot, '启动公开版题库.template.cmd'),
  audioLicensePath = defaultAudioLicensePath,
  audioAttributionPath = defaultAudioAttributionPath,
}) {
  const resolvedOutputRoot = resolve(outputRoot)
  const stagingDirectory = await mkdtemp(join(resolvedOutputRoot, '.staging-'))
  const packageDirectory = join(stagingDirectory, packageDirectoryName)
  const siteDirectory = join(packageDirectory, 'site')
  const thirdPartyLicensesDirectory = join(packageDirectory, 'third-party-licenses')

  await mkdir(packageDirectory)
  await mkdir(thirdPartyLicensesDirectory)
  await cp(buildDirectory, siteDirectory, { recursive: true })
  await rm(join(siteDirectory, 'license.json'), { force: true })
  await copyFile(nodePath, join(packageDirectory, 'node.exe'))
  await copyFile(serverSourcePath, join(packageDirectory, 'server.mjs'))
  await copyFile(audioLicensePath, join(thirdPartyLicensesDirectory, 'KOKORO-82M-APACHE-2.0.txt'))
  await copyFile(audioAttributionPath, join(thirdPartyLicensesDirectory, 'ATTRIBUTION.md'))

  const launcherTemplate = await readFile(launcherTemplatePath, 'utf8')
  await writeFile(join(packageDirectory, '启动学位英语题库.cmd'), launcherTemplate, 'utf8')
  await writeFile(join(packageDirectory, '使用说明.txt'), publicUsageGuide(), 'utf8')

  return { stagingDirectory, packageDirectory }
}

export async function createPublicRelease({
  outputRoot,
  projectRoot = defaultProjectRoot,
  buildDirectory,
  nodePath,
  serverSourcePath,
  launcherTemplatePath,
  audioLicensePath,
  audioAttributionPath,
  audioManifestPath = defaultAudioManifestPath,
  sevenZipPath,
  run = defaultRun,
  verifyAudio = verifyWordAudio,
}) {
  const resolvedOutputRoot = resolve(outputRoot)
  const resolvedBuildDirectory = buildDirectory ?? join(projectRoot, 'web', 'dist')
  const archivePath = join(resolvedOutputRoot, archiveFileName)
  let stagingDirectory
  let completed = false

  await mkdir(resolvedOutputRoot, { recursive: true })
  if (existsSync(archivePath)) {
    throw new Error(`公开版发布包已存在：${archivePath}`)
  }

  try {
    if (!buildDirectory) {
      const npmCommand = process.platform === 'win32' ? process.env.ComSpec ?? 'cmd.exe' : 'npm'
      const npmArguments = process.platform === 'win32'
        ? ['/d', '/s', '/c', 'npm.cmd run build']
        : ['run', 'build']
      await run(npmCommand, npmArguments, { cwd: join(projectRoot, 'web') })
    }

    await verifyAudio({
      manifestPath: audioManifestPath,
      audioDirectory: join(resolvedBuildDirectory, 'audio', 'words'),
    })

    const staged = await stagePublicRelease({
      buildDirectory: resolvedBuildDirectory,
      outputRoot: resolvedOutputRoot,
      nodePath,
      serverSourcePath,
      launcherTemplatePath,
      audioLicensePath,
      audioAttributionPath,
    })
    stagingDirectory = staged.stagingDirectory
    const resolvedSevenZipPath = findSevenZip(sevenZipPath)

    await run(resolvedSevenZipPath, [
      'a',
      '-tzip',
      '-mcu=on',
      archivePath,
      packageDirectoryName,
    ], { cwd: stagingDirectory })

    completed = true
    return { archivePath, sha256: await sha256File(archivePath) }
  } finally {
    if (stagingDirectory) {
      await rm(stagingDirectory, { recursive: true, force: true })
    }
    if (!completed) {
      await rm(archivePath, { force: true })
    }
  }
}
