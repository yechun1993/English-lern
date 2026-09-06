import assert from 'node:assert/strict'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { createAuthorizedServer } from './server.mjs'

test('serves only the study site and package authorization metadata', async () => {
  const packageRoot = await mkdtemp(join(tmpdir(), 'szu-degree-english-server-'))
  const siteRoot = join(packageRoot, 'site')
  const assetsRoot = join(siteRoot, 'assets')
  await mkdir(assetsRoot, { recursive: true })
  await writeFile(join(siteRoot, 'index.html'), '<!doctype html><title>study site</title>')
  await writeFile(join(assetsRoot, 'app.js'), 'console.log("study site")')
  await writeFile(join(packageRoot, 'license.json'), '{"authorizationId":"SZU-2026-001"}')

  let server
  try {
    const running = await createAuthorizedServer({ packageRoot, host: '127.0.0.1', port: 0 })
    server = running.server
    const { url } = running

    assert.equal((await fetch(`${url}/`)).status, 200)
    assert.match(await (await fetch(`${url}/`)).text(), /study site/)
    assert.equal((await fetch(`${url}/license.json`)).status, 200)
    assert.equal((await fetch(`${url}/missing-route`)).status, 200)
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
