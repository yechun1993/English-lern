import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createPublicServer } from './server.mjs'

test('serves the public study site without any authorization route', async () => {
  const packageRoot = await mkdtemp(join(tmpdir(), 'szu-degree-english-public-server-'))
  const siteRoot = join(packageRoot, 'site')
  const assetsRoot = join(siteRoot, 'assets')
  const audioRoot = join(siteRoot, 'audio', 'words')
  await mkdir(assetsRoot, { recursive: true })
  await mkdir(audioRoot, { recursive: true })
  await writeFile(join(siteRoot, 'index.html'), '<main>公开题库</main>')
  await writeFile(join(assetsRoot, 'app.js'), 'console.log("ok")')
  await writeFile(join(audioRoot, '0001.mp3'), 'fake audio')

  let server
  try {
    const running = await createPublicServer({ packageRoot, host: '127.0.0.1', port: 0 })
    server = running.server
    const { url } = running

    assert.equal((await fetch(`${url}/`)).status, 200)
    assert.match(await (await fetch(`${url}/unknown-route`)).text(), /公开题库/)
    assert.match(await (await fetch(`${url}/assets/app.js`)).text(), /console\.log/)
    assert.equal((await fetch(`${url}/audio/words/0001.mp3`)).headers.get('content-type'), 'audio/mpeg')
    assert.equal((await fetch(`${url}/license.json`)).status, 404)
    assert.equal((await fetch(`${url}/..%2Fserver.mjs`)).status, 403)
    assert.equal((await fetch(`${url}/`, { method: 'POST' })).status, 405)
  } finally {
    await new Promise((resolve, reject) => {
      if (!server) {
        resolve()
        return
      }
      server.close((error) => error ? reject(error) : resolve())
    })
    await rm(packageRoot, { recursive: true, force: true })
  }
})
