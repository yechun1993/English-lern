import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { networkInterfaces } from 'node:os'
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const allowedMethods = new Set(['GET', 'HEAD'])
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
])

function isWithinDirectory(root, candidate) {
  const candidateRelativePath = relative(root, candidate)
  return candidateRelativePath !== ''
    && candidateRelativePath !== '..'
    && !candidateRelativePath.startsWith(`..${sep}`)
    && !isAbsolute(candidateRelativePath)
}

function send(response, statusCode, body = '', headers = {}) {
  response.writeHead(statusCode, headers)
  response.end(body)
}

async function sendFile(response, method, filePath, { noStore = false } = {}) {
  try {
    const content = await readFile(filePath)
    const headers = {
      'Content-Type': mimeTypes.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream',
      ...(noStore ? { 'Cache-Control': 'no-store' } : {}),
    }
    response.writeHead(200, headers)
    response.end(method === 'HEAD' ? undefined : content)
    return true
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && ['ENOENT', 'EISDIR'].includes(error.code)) {
      return false
    }

    send(response, 500, 'Internal Server Error')
    return true
  }
}

function decodePathname(requestUrl) {
  try {
    return { pathname: decodeURIComponent(new URL(requestUrl ?? '/', 'http://localhost').pathname) }
  } catch {
    return { error: 400 }
  }
}

export async function createAuthorizedServer({ packageRoot, host = '0.0.0.0', port = 4173 }) {
  const resolvedPackageRoot = resolve(packageRoot)
  const siteRoot = resolve(resolvedPackageRoot, 'site')

  const server = createServer(async (request, response) => {
    const method = request.method ?? 'GET'
    if (!allowedMethods.has(method)) {
      send(response, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' })
      return
    }

    const decodedPath = decodePathname(request.url)
    if ('error' in decodedPath) {
      send(response, decodedPath.error, 'Bad Request')
      return
    }

    if (decodedPath.pathname === '/license.json') {
      const served = await sendFile(response, method, join(resolvedPackageRoot, 'license.json'), { noStore: true })
      if (!served) {
        send(response, 404, 'Not Found')
      }
      return
    }

    const requestedFile = decodedPath.pathname === '/'
      ? join(siteRoot, 'index.html')
      : resolve(siteRoot, `.${decodedPath.pathname}`)

    if (!isWithinDirectory(siteRoot, requestedFile)) {
      send(response, 403, 'Forbidden')
      return
    }

    const served = await sendFile(response, method, requestedFile)
    if (served) {
      return
    }

    if (extname(decodedPath.pathname)) {
      send(response, 404, 'Not Found')
      return
    }

    const fallbackServed = await sendFile(response, method, join(siteRoot, 'index.html'))
    if (!fallbackServed) {
      send(response, 404, 'Not Found')
    }
  })

  await new Promise((resolveListening, rejectListening) => {
    server.once('error', rejectListening)
    server.listen(port, host, () => {
      server.off('error', rejectListening)
      resolveListening()
    })
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('本地服务器未能取得监听地址。')
  }

  return { server, url: `http://${host}:${address.port}` }
}

function listLanUrls(port) {
  const urls = new Set(['http://127.0.0.1:' + port + '/'])
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        urls.add(`http://${address.address}:${port}/`)
      }
    }
  }
  return [...urls]
}

async function runCli() {
  const { server } = await createAuthorizedServer({
    packageRoot: process.cwd(),
    host: '0.0.0.0',
    port: 4173,
  })
  const urls = listLanUrls(4173)
  let authorizationId
  try {
    const license = JSON.parse(await readFile(join(process.cwd(), 'license.json'), 'utf8'))
    authorizationId = typeof license.authorizationId === 'string' ? license.authorizationId : undefined
  } catch {
    authorizationId = undefined
  }

  console.log(`本机地址：${urls[0]}`)
  for (const url of urls.slice(1)) {
    console.log(`同一可信 Wi-Fi 的平板地址：${url}`)
  }
  if (authorizationId) {
    console.log(`授权编号：${authorizationId}`)
  }
  console.log('仅授权个人学习使用，禁止转发、复制、售卖')

  if (process.argv.includes('--open')) {
    const browser = spawn('cmd.exe', ['/c', 'start', '', urls[0]], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    })
    browser.unref()
  }

  const stop = () => server.close(() => process.exit(0))
  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCli().catch((error) => {
    console.error(error instanceof Error ? error.message : '本地服务器启动失败。')
    process.exitCode = 1
  })
}
