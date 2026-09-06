import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  createAuthorizedPackage,
  createLicense,
  stageBuyerPackage,
  validateAuthorizationId,
  validatePackagePassword,
} from './package-lib.mjs'

const notice = '仅授权个人学习使用，禁止转发、复制、售卖'

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), 'szu-degree-english-package-'))
  const buildDirectory = join(root, 'web', 'dist')
  const assetsDirectory = join(buildDirectory, 'assets')
  const outputRoot = join(root, 'output')
  await mkdir(assetsDirectory, { recursive: true })
  await mkdir(outputRoot)
  await writeFile(join(buildDirectory, 'index.html'), '<!doctype html><title>study site</title>')
  await writeFile(join(assetsDirectory, 'app.js'), 'console.log("study site")')
  await writeFile(join(buildDirectory, 'license.json'), '{"authorizationId":"DEV-LOCAL-ONLY"}')
  await writeFile(join(root, 'node-source.exe'), 'fake node runtime')
  await writeFile(join(root, '7z.exe'), 'fake 7-Zip runtime')
  await writeFile(join(root, 'server.mjs'), 'export {}')
  await writeFile(join(root, 'launcher.template.cmd'), '授权编号：<AUTHORIZATION_ID>')
  return { root, buildDirectory, outputRoot }
}

test('validates a seller authorization ID', () => {
  assert.equal(validateAuthorizationId('SZU-2026_001'), 'SZU-2026_001')
  for (const invalidValue of ['', 'AB', 'SZU 001', 'SZU/001', 'a'.repeat(65)]) {
    assert.throws(
      () => validateAuthorizationId(invalidValue),
      { message: '授权编号只能包含字母、数字、连字符和下划线，长度为 3–64 个字符。' },
    )
  }
})

test('requires a nonempty confirmed archive password', () => {
  assert.equal(validatePackagePassword('Secret_2026!', 'Secret_2026!'), 'Secret_2026!')
  assert.throws(() => validatePackagePassword('', ''), { message: '压缩包密码不能为空。' })
  assert.throws(() => validatePackagePassword('Secret_2026!', 'Different_2026!'), { message: '两次输入的密码不一致。' })
})

test('stages only buyer runtime files and replaces the license metadata', async () => {
  const fixture = await createFixture()
  try {
    const staged = await stageBuyerPackage({
      authorizationId: 'SZU-2026-001',
      buildDirectory: fixture.buildDirectory,
      nodePath: join(fixture.root, 'node-source.exe'),
      outputRoot: fixture.outputRoot,
      serverSourcePath: join(fixture.root, 'server.mjs'),
      launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
    })
    const entries = await readdir(staged.packageDirectory)

    assert.deepEqual(entries.sort(), [
      'license.json',
      'node.exe',
      'server.mjs',
      'site',
      '个人学习授权说明.txt',
      '使用说明.txt',
      '启动学位英语题库.cmd',
    ].sort())
    await assert.rejects(readFile(join(staged.packageDirectory, 'site', 'license.json')))
    assert.deepEqual(JSON.parse(await readFile(join(staged.packageDirectory, 'license.json'), 'utf8')), createLicense('SZU-2026-001'))
    assert.match(await readFile(join(staged.packageDirectory, '启动学位英语题库.cmd'), 'utf8'), /SZU-2026-001/)
    assert.match(await readFile(join(staged.packageDirectory, '个人学习授权说明.txt'), 'utf8'), new RegExp(notice))
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('uses encrypted 7z flags and records a password-free delivery ledger', async () => {
  const fixture = await createFixture()
  const password = 'NotStored_2026!'
  const calls = []
  try {
    const result = await createAuthorizedPackage({
      authorizationId: 'SZU-2026-001',
      password,
      outputRoot: fixture.outputRoot,
      buildDirectory: fixture.buildDirectory,
      nodePath: join(fixture.root, 'node-source.exe'),
      serverSourcePath: join(fixture.root, 'server.mjs'),
      launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
      sevenZipPath: join(fixture.root, '7z.exe'),
      now: () => new Date('2026-09-06T12:00:00.000Z'),
      run: async (command, args) => {
        calls.push({ command, args })
        if (args[0] === 'a') {
          await writeFile(args[4], 'encrypted archive placeholder')
        }
        return { stdout: '', stderr: '' }
      },
    })
    const archiveCall = calls.find((call) => call.args[0] === 'a')
    const ledger = await readFile(result.ledgerPath, 'utf8')
    const license = JSON.stringify(createLicense('SZU-2026-001'))

    assert.ok(archiveCall)
    assert.deepEqual(archiveCall.args.slice(0, 4), ['a', '-t7z', '-mhe=on', `-p${password}`])
    assert.equal(archiveCall.args.at(-1), '深大学位英语_个人授权_SZU-2026-001')
    assert.equal((await readdir(fixture.outputRoot)).includes('深大学位英语_个人授权_SZU-2026-001.7z'), true)
    assert.equal(result.sha256.length, 64)
    assert.equal(JSON.parse(ledger).authorizationId, 'SZU-2026-001')
    assert.equal(JSON.parse(ledger).fileName, '深大学位英语_个人授权_SZU-2026-001.7z')
    assert.equal(license.includes(password), false)
    assert.equal(ledger.includes(password), false)
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})

test('uses the Windows command processor for the production npm build', async () => {
  const fixture = await createFixture()
  const calls = []
  try {
    await createAuthorizedPackage({
      authorizationId: 'SZU-2026-BUILD',
      password: 'Secret_2026!',
      outputRoot: fixture.outputRoot,
      projectRoot: fixture.root,
      nodePath: join(fixture.root, 'node-source.exe'),
      serverSourcePath: join(fixture.root, 'server.mjs'),
      launcherTemplatePath: join(fixture.root, 'launcher.template.cmd'),
      sevenZipPath: join(fixture.root, '7z.exe'),
      run: async (command, args) => {
        calls.push({ command, args })
        if (args[0] === 'a') {
          await writeFile(args[4], 'encrypted archive placeholder')
        }
        return { stdout: '', stderr: '' }
      },
    })

    assert.equal(calls[0].command, process.env.ComSpec ?? 'cmd.exe')
    assert.deepEqual(calls[0].args, ['/d', '/s', '/c', 'npm.cmd run build'])
  } finally {
    await rm(fixture.root, { recursive: true, force: true })
  }
})
