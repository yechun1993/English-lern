import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createPublicRelease, stagePublicRelease } from './package-lib.mjs'

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), 'szu-degree-english-public-package-'))
  const buildDirectory = join(root, 'web', 'dist')
  const assetsDirectory = join(buildDirectory, 'assets')
  const audioDirectory = join(buildDirectory, 'audio', 'words')
  const outputRoot = join(root, 'output')
  await mkdir(assetsDirectory, { recursive: true })
  await mkdir(audioDirectory, { recursive: true })
  await mkdir(outputRoot)
  await writeFile(join(buildDirectory, 'index.html'), '<!doctype html><title>公开题库</title>')
  await writeFile(join(assetsDirectory, 'app.js'), 'console.log("公开题库")')
  await writeFile(join(audioDirectory, '0001.mp3'), 'fake audio')
  await writeFile(join(buildDirectory, 'license.json'), '{"authorizationId":"DEV-LOCAL-ONLY"}')
  await writeFile(join(root, 'node-source.exe'), 'fake node runtime')
  await writeFile(join(root, '7z.exe'), 'fake 7-Zip runtime')
  await writeFile(join(root, 'server.mjs'), 'export {}')
  await writeFile(join(root, 'launcher.template.cmd'), '"%~dp0node.exe" "%~dp0server.mjs" --open')
  await writeFile(join(root, 'KOKORO-82M-APACHE-2.0.txt'), 'Apache License 2.0')
  await writeFile(join(root, 'ATTRIBUTION.md'), 'Kokoro attribution')
  return { root, buildDirectory, outputRoot }
}

test('stages only public runtime files without authorization metadata', async () => {
  const fixture = await createFixture()
  try {
    const staged = await stagePublicRelease({
      buildDirectory: fixture.buildDirectory,
      nodePath: join(fixture.root, 'node-source.exe'),
      outputRoot: fixture.outputRoot,
      serverSourcePath: join(fixture.root, 'server.mjs'),
      launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
      audioLicensePath: join(fixture.root, 'KOKORO-82M-APACHE-2.0.txt'),
      audioAttributionPath: join(fixture.root, 'ATTRIBUTION.md'),
    })

    assert.deepEqual((await readdir(staged.packageDirectory)).sort(), [
      'node.exe',
      'server.mjs',
      'site',
      'third-party-licenses',
      '使用说明.txt',
      '启动学位英语题库.cmd',
    ].sort())
    await assert.rejects(readFile(join(staged.packageDirectory, 'site', 'license.json')))
    assert.match(await readFile(join(staged.packageDirectory, '启动学位英语题库.cmd'), 'utf8'), /node\.exe/)
    assert.match(await readFile(join(staged.packageDirectory, '使用说明.txt'), 'utf8'), /公开学习版/)
    assert.match(await readFile(join(staged.packageDirectory, 'third-party-licenses', 'ATTRIBUTION.md'), 'utf8'), /Kokoro/)
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('creates a password-free public ZIP and refuses to overwrite it', async () => {
  const fixture = await createFixture()
  const calls = []
  try {
    const release = await createPublicRelease({
      outputRoot: fixture.outputRoot,
      buildDirectory: fixture.buildDirectory,
      nodePath: join(fixture.root, 'node-source.exe'),
      serverSourcePath: join(fixture.root, 'server.mjs'),
      launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
      audioLicensePath: join(fixture.root, 'KOKORO-82M-APACHE-2.0.txt'),
      audioAttributionPath: join(fixture.root, 'ATTRIBUTION.md'),
      sevenZipPath: join(fixture.root, '7z.exe'),
      verifyAudio: async () => ({ expectedCount: 1911, verifiedCount: 1911 }),
      run: async (command, args) => {
        calls.push({ command, args })
        if (args[0] === 'a') {
          const archiveArgument = args.find((argument) => argument.endsWith('.zip'))
          assert.ok(archiveArgument)
          await writeFile(archiveArgument, 'public archive placeholder')
        }
        return { stdout: '', stderr: '' }
      },
    })

    const archiveCall = calls.find((call) => call.args[0] === 'a')
    assert.ok(archiveCall)
    assert.deepEqual(archiveCall.args.slice(0, 2), ['a', '-tzip'])
    assert.equal(archiveCall.args.includes('-mcu=on'), true)
    assert.equal(archiveCall.args.at(-1), '深大学位英语题库_公开版_v1.1.0')
    assert.equal(archiveCall.args.some((argument) => argument.startsWith('-p')), false)
    assert.match(release.archivePath, /深大学位英语题库_公开版_v1\.1\.0\.zip$/)
    assert.equal(release.sha256.length, 64)

    await assert.rejects(
      createPublicRelease({
        outputRoot: fixture.outputRoot,
        buildDirectory: fixture.buildDirectory,
        nodePath: join(fixture.root, 'node-source.exe'),
        serverSourcePath: join(fixture.root, 'server.mjs'),
        launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
        sevenZipPath: join(fixture.root, '7z.exe'),
      }),
      { message: `公开版发布包已存在：${release.archivePath}` },
    )
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('stops before 7-Zip when the audio inventory is invalid', async () => {
  const fixture = await createFixture()
  const calls = []
  try {
    await assert.rejects(
      createPublicRelease({
        outputRoot: fixture.outputRoot,
        buildDirectory: fixture.buildDirectory,
        nodePath: join(fixture.root, 'node-source.exe'),
        serverSourcePath: join(fixture.root, 'server.mjs'),
        launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
        audioLicensePath: join(fixture.root, 'KOKORO-82M-APACHE-2.0.txt'),
        audioAttributionPath: join(fixture.root, 'ATTRIBUTION.md'),
        sevenZipPath: join(fixture.root, '7z.exe'),
        verifyAudio: async () => { throw new Error('缺少 0001.mp3') },
        run: async (command, args) => {
          calls.push({ command, args })
          return { stdout: '', stderr: '' }
        },
      }),
      /缺少 0001\.mp3/,
    )
    assert.equal(calls.some((call) => call.args[0] === 'a'), false)
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})
