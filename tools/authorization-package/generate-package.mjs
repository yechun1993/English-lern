import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { createAuthorizedPackage, validatePackagePassword } from './package-lib.mjs'

function maskSecretInMessage(message, secrets) {
  return secrets.reduce(
    (safeMessage, secret) => secret ? safeMessage.replaceAll(secret, '******') : safeMessage,
    message,
  )
}

async function readLine(prompt) {
  const readline = createInterface({ input: stdin, output: stdout })
  try {
    return (await readline.question(prompt)).trim()
  } finally {
    readline.close()
  }
}

function readSecret(prompt) {
  if (!stdin.isTTY || !stdout.isTTY) {
    return Promise.reject(new Error('请双击“生成个人授权包.cmd”后在打开的窗口中输入密码。'))
  }

  return new Promise((resolve, reject) => {
    let value = ''
    const wasRaw = stdin.isRaw

    function cleanup() {
      stdin.off('data', onData)
      stdin.setRawMode(wasRaw)
      stdin.pause()
    }

    function onData(chunk) {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          cleanup()
          stdout.write('\n')
          reject(new Error('已取消生成授权包。'))
          return
        }
        if (character === '\r' || character === '\n') {
          cleanup()
          stdout.write('\n')
          resolve(value)
          return
        }
        if (character === '\b' || character === '\u007f') {
          if (value.length > 0) {
            value = value.slice(0, -1)
            stdout.write('\b \b')
          }
          continue
        }
        if (character >= ' ') {
          value += character
          stdout.write('*')
        }
      }
    }

    stdout.write(prompt)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.on('data', onData)
  })
}

async function main() {
  let password = ''
  let confirmation = ''
  try {
    const authorizationId = await readLine('授权编号：')
    password = await readSecret('压缩包密码：')
    confirmation = await readSecret('再次输入密码：')
    validatePackagePassword(password, confirmation)

    const result = await createAuthorizedPackage({ authorizationId, password, outputRoot: '授权包输出' })
    console.log('\n授权包生成完成。')
    console.log(`文件：${result.archivePath}`)
    console.log(`授权编号：${authorizationId}`)
    console.log(`SHA-256：${result.sha256}`)
    console.log('请通过与压缩包不同的渠道发送密码。')
  } catch (error) {
    const message = error instanceof Error ? error.message : '生成授权包失败。'
    console.error(maskSecretInMessage(message, [password, confirmation]))
    process.exitCode = 1
  }
}

void main()
