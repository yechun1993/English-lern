import { createHash } from 'node:crypto'
import { appendFile, copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const notice = '仅授权个人学习使用，禁止转发、复制、售卖'
const authorizationIdPattern = /^[A-Za-z0-9_-]{3,64}$/
const authorizationIdValidationMessage = '授权编号只能包含字母、数字、连字符和下划线，长度为 3–64 个字符。'
const moduleDirectory = dirname(fileURLToPath(import.meta.url))
const defaultProjectRoot = resolve(moduleDirectory, '..', '..')

function packageName(authorizationId) {
  return `深大学位英语_个人授权_${authorizationId}`
}

function buyerLicenseAgreement(authorizationId) {
  return `个人学习授权说明

授权编号：${authorizationId}
${notice}

本产品仅限获得授权的个人学习使用。不得将本压缩包、解压后的程序、题库内容或其复制件转发、复制、出租、出售或用于其他商业用途。
`
}

function buyerUsageGuide() {
  return `使用说明

1. 使用卖家单独发送的密码，用 7-Zip 或 Bandizip 解压本文件。
2. 双击“启动学位英语题库.cmd”。请保持弹出的窗口打开。
3. 浏览器会自动打开学习网站；同一可信 Wi-Fi 下的平板可访问窗口显示的局域网地址。
4. 请勿在公共网络中允许防火墙访问，也不要向他人转发此授权包或密码。
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

export function validateAuthorizationId(value) {
  if (typeof value !== 'string' || !authorizationIdPattern.test(value)) {
    throw new Error(authorizationIdValidationMessage)
  }
  return value
}

export function createLicense(authorizationId) {
  return { authorizationId: validateAuthorizationId(authorizationId), notice }
}

export function validatePackagePassword(password, confirmation) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('压缩包密码不能为空。')
  }
  if (password !== confirmation) {
    throw new Error('两次输入的密码不一致。')
  }
  return password
}

export async function stageBuyerPackage({
  authorizationId,
  buildDirectory,
  outputRoot,
  nodePath = process.execPath,
  serverSourcePath = join(moduleDirectory, 'server.mjs'),
  launcherTemplatePath = join(defaultProjectRoot, '启动学位英语题库.template.cmd'),
}) {
  const validatedAuthorizationId = validateAuthorizationId(authorizationId)
  const stagingDirectory = await mkdtemp(join(resolve(outputRoot), '.staging-'))
  const packageDirectory = join(stagingDirectory, packageName(validatedAuthorizationId))
  const siteDirectory = join(packageDirectory, 'site')

  await mkdir(packageDirectory)
  await cp(buildDirectory, siteDirectory, { recursive: true })
  await rm(join(siteDirectory, 'license.json'), { force: true })
  await copyFile(nodePath, join(packageDirectory, 'node.exe'))
  await copyFile(serverSourcePath, join(packageDirectory, 'server.mjs'))
  await writeFile(
    join(packageDirectory, 'license.json'),
    `${JSON.stringify(createLicense(validatedAuthorizationId), null, 2)}\n`,
    'utf8',
  )

  const launcherTemplate = await readFile(launcherTemplatePath, 'utf8')
  await writeFile(
    join(packageDirectory, '启动学位英语题库.cmd'),
    launcherTemplate.replaceAll('<AUTHORIZATION_ID>', validatedAuthorizationId),
    'utf8',
  )
  await writeFile(join(packageDirectory, '个人学习授权说明.txt'), buyerLicenseAgreement(validatedAuthorizationId), 'utf8')
  await writeFile(join(packageDirectory, '使用说明.txt'), buyerUsageGuide(), 'utf8')

  return { stagingDirectory, packageDirectory }
}

export async function createAuthorizedPackage({
  authorizationId,
  password,
  outputRoot,
  projectRoot = defaultProjectRoot,
  buildDirectory,
  nodePath,
  serverSourcePath,
  launcherTemplatePath,
  sevenZipPath,
  now = () => new Date(),
  run = defaultRun,
}) {
  const validatedAuthorizationId = validateAuthorizationId(authorizationId)
  validatePackagePassword(password, password)

  const resolvedOutputRoot = resolve(outputRoot)
  const resolvedBuildDirectory = buildDirectory ?? join(projectRoot, 'web', 'dist')
  const archivePath = join(resolvedOutputRoot, `${packageName(validatedAuthorizationId)}.7z`)
  let stagingDirectory
  let completed = false

  await mkdir(resolvedOutputRoot, { recursive: true })
  if (existsSync(archivePath)) {
    throw new Error(`授权包已存在：${archivePath}`)
  }

  try {
    if (!buildDirectory) {
      await run(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], {
        cwd: join(projectRoot, 'web'),
      })
    }

    const staged = await stageBuyerPackage({
      authorizationId: validatedAuthorizationId,
      buildDirectory: resolvedBuildDirectory,
      outputRoot: resolvedOutputRoot,
      nodePath,
      serverSourcePath,
      launcherTemplatePath,
    })
    stagingDirectory = staged.stagingDirectory
    const resolvedSevenZipPath = findSevenZip(sevenZipPath)

    await run(resolvedSevenZipPath, [
      'a',
      '-t7z',
      '-mhe=on',
      `-p${password}`,
      archivePath,
      `${staged.packageDirectory}\\*`,
    ], { cwd: stagingDirectory })

    const sha256 = await sha256File(archivePath)
    const ledgerPath = join(resolvedOutputRoot, '授权交付清单.jsonl')
    const ledgerEntry = {
      generatedAt: now().toISOString(),
      authorizationId: validatedAuthorizationId,
      fileName: `${packageName(validatedAuthorizationId)}.7z`,
      sha256,
    }
    await appendFile(ledgerPath, `${JSON.stringify(ledgerEntry)}\n`, 'utf8')
    completed = true
    return { archivePath, sha256, ledgerPath }
  } finally {
    if (stagingDirectory) {
      await rm(stagingDirectory, { recursive: true, force: true })
    }
    if (!completed) {
      await rm(archivePath, { force: true })
    }
  }
}
