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
  const outputRoot = join(root, 'output')
  await mkdir(assetsDirectory, { recursive: true })
  await mkdir(outputRoot)
  await writeFile(join(buildDirectory, 'index.html'), '<!doctype html><title>公开题库</title>')
  await writeFile(join(assetsDirectory, 'app.js'), 'console.log("公开题库")')
  await writeFile(join(buildDirectory, 'license.json'), '{"authorizationId":"DEV-LOCAL-ONLY"}')
  await writeFile(join(root, 'node-source.exe'), 'fake node runtime')
  await writeFile(join(root, '7z.exe'), 'fake 7-Zip runtime')
  await writeFile(join(root, 'server.mjs'), 'export {}')
  await writeFile(join(root, 'launcher.template.cmd'), '"%~dp0node.exe" "%~dp0server.mjs" --open')
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
    })

    assert.deepEqual((await readdir(staged.packageDirectory)).sort(), [
      'node.exe',
      'server.mjs',
      'site',
      '使用说明.txt',
      '启动学位英语题库.cmd',
    ].sort())
    await assert.rejects(readFile(join(staged.packageDirectory, 'site', 'license.json')))
    assert.match(await readFile(join(staged.packageDirectory, '启动学位英语题库.cmd'), 'utf8'), /node\.exe/)
    assert.match(await readFile(join(staged.packageDirectory, '使用说明.txt'), 'utf8'), /公开学习版/)
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
      sevenZipPath: join(fixture.root, '7z.exe'),
      run: async (command, args) => {
        calls.push({ command, args })
        if (args[0] === 'a') {
          await writeFile(args[2], 'public archive placeholder')
        }
        return { stdout: '', stderr: '' }
      },
    })

    const archiveCall = calls.find((call) => call.args[0] === 'a')
    assert.ok(archiveCall)
    assert.deepEqual(archiveCall.args.slice(0, 2), ['a', '-tzip'])
    assert.equal(archiveCall.args.at(-1), '深大学位英语题库_公开版_v1.0.0')
    assert.equal(archiveCall.args.some((argument) => argument.startsWith('-p')), false)
    assert.match(release.archivePath, /深大学位英语题库_公开版_v1\.0\.0\.zip$/)
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
