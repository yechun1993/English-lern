import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

test('public source tree does not retain personal-authorization distribution files', () => {
  for (const relativePath of [
    'tools/authorization-package/generate-package.mjs',
    'tools/authorization-package/package-lib.mjs',
    'tools/authorization-package/package-lib.test.mjs',
    'tools/authorization-package/server.mjs',
    'tools/authorization-package/server.test.mjs',
    '生成个人授权包.cmd',
    '启动学位英语题库.template.cmd',
    '授权包输出/.gitkeep',
  ]) {
    assert.equal(existsSync(join(projectRoot, relativePath)), false, `${relativePath} must not be public`)
  }
})
