# Personal Authorized Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Windows seller-side generator that creates a password-protected AES-256 `.7z` package of the degree-English study site, with a unique visible authorization number in the buyer's local app.

**Architecture:** The browser app loads `/license.json` into a small authorization-status component that appears before every screen root. A Node-based seller generator validates the authorization number, builds the Vite site, stages only buyer runtime files, and invokes a locally installed 7-Zip CLI to create the encrypted archive. The staged buyer runtime uses its bundled `node.exe` and a purpose-built read-only static server, so it does not need npm or the source repository.

**Tech Stack:** React 19, TypeScript, Vite PWA, Vitest, Playwright with Microsoft Edge, Node.js 24, Node built-in test runner, Windows CMD, 7-Zip CLI.

## Global Constraints

- The fixed visible notice is exactly `仅授权个人学习使用，禁止转发、复制、售卖`.
- Authorization IDs accept only letters, digits, hyphens, and underscores, with a length from 3 to 64 characters.
- Do not display buyer names, phone numbers, or other personal data.
- The generator must never write a password to the package, the release ledger, the repository, a command output file, or Git.
- The archive command must use 7-Zip `.7z`, AES-256, and encrypted file names (`-mhe=on`).
- A buyer archive contains only the launch script, `node.exe`, `server.mjs`, `license.json`, two Chinese instruction files, and `site/`; it must not contain source code, `node_modules`, a generator, or a seller ledger.
- The buyer server accepts only HTTP `GET` and `HEAD`, serves only `site/` plus the package-root `license.json`, rejects path traversal, and binds to the buyer's trusted LAN.
- Keep local LAN access optional; do not add accounts, public hosting, activation, device binding, synchronization, or remote revocation.
- Test all new behavior before adding its production implementation; keep each task independently verifiable and commit it when its tests pass.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `web/public/license.json` | Development-safe authorization metadata, excluded from PWA precache. Seller staging replaces its runtime value. |
| `web/src/license/license.ts` | Validates the browser-fetched authorization JSON and exposes `loadLicense`. |
| `web/src/license/license.test.ts` | Unit tests for valid JSON and invalid/missing authorization data. |
| `web/src/components/LicenseNotice.tsx` | Renders the authorization ID or the fixed load-failure message. |
| `web/src/components/LicenseNotice.css` | Responsive visual treatment shared across dashboard, hubs, and exercises. |
| `web/src/components/LicenseNotice.test.tsx` | Component rendering tests for valid and invalid states. |
| `web/src/App.tsx` | Loads authorization state once and mounts the notice for every route-like screen branch. |
| `web/src/App.test.tsx` | Application-level test that the notice remains visible after entering practice. |
| `web/vite.config.ts` | Keeps `license.json` out of the service-worker precache so a staged package cannot show an old ID. |
| `tools/authorization-package/package-lib.mjs` | Pure validation, staging, documentation, SHA-256, archive invocation, and ledger helpers. |
| `tools/authorization-package/package-lib.test.mjs` | Node built-in tests for ID validation, staging allowlist, ledger content, and archive command flags. |
| `tools/authorization-package/generate-package.mjs` | Interactive seller CLI: masked password prompts, build, stage, archive, and result output. |
| `tools/authorization-package/server.mjs` | Buyer static server with method, MIME, traversal, and SPA-fallback rules. |
| `tools/authorization-package/server.test.mjs` | Node built-in integration tests for valid content, `/license.json`, blocked traversal, and methods. |
| `生成个人授权包.cmd` | Seller double-click entry point; calls the generator and pauses on success or failure. |
| `启动学位英语题库.template.cmd` | Template copied into each buyer staging directory, with the generated authorization ID inserted. |
| `授权包输出/.gitkeep` | Default local output directory, with generated content ignored by Git. |
| `.gitignore` | Excludes staged release directories, generated archives, and seller ledger from Git. |
| `web/package.json` | Adds `test:package` to run the Node package tests. |
| `README.md` | Documents seller prerequisites, safe password delivery, package generation, and buyer operation. |

### Task 1: Make authorization information a tested part of every browser screen

**Files:**
- Create: `web/public/license.json`
- Create: `web/src/license/license.ts`
- Create: `web/src/license/license.test.ts`
- Create: `web/src/components/LicenseNotice.tsx`
- Create: `web/src/components/LicenseNotice.css`
- Create: `web/src/components/LicenseNotice.test.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.test.tsx`
- Modify: `web/vite.config.ts`

**Interfaces:**
- Consumes: browser `fetch` and a JSON object with `authorizationId` and `notice` strings.
- Produces: `type LicenseState = { status: 'ready'; authorizationId: string; notice: string } | { status: 'error' }`, `async function loadLicense(fetchImpl?: typeof fetch): Promise<LicenseState>`, and `<LicenseNotice state={state} />`.

- [ ] **Step 1: Write the license-domain failure tests**

Create `web/src/license/license.test.ts` with these exact cases:

```ts
import { describe, expect, it, vi } from 'vitest'
import { loadLicense } from './license'

describe('loadLicense', () => {
  it('returns a ready state for the required authorization metadata', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }), { status: 200 }))

    await expect(loadLicense(fetchImpl)).resolves.toEqual({
      status: 'ready',
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    })
    expect(fetchImpl).toHaveBeenCalledWith('/license.json', { cache: 'no-store' })
  })

  it('returns an error state for a missing or malformed authorization file', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('{"authorizationId":""}', { status: 200 }))

    await expect(loadLicense(fetchImpl)).resolves.toEqual({ status: 'error' })
  })
})
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `npm run test:run -- src/license/license.test.ts`

Expected: FAIL because `./license` does not exist.

- [ ] **Step 3: Implement strict authorization parsing**

Create `web/src/license/license.ts` with this implementation:

```ts
export interface ReadyLicenseState {
  status: 'ready'
  authorizationId: string
  notice: string
}

export type LicenseState = ReadyLicenseState | { status: 'error' }

const authorizationIdPattern = /^[A-Za-z0-9_-]{3,64}$/
const requiredNotice = '仅授权个人学习使用，禁止转发、复制、售卖'

function isValidLicense(value: unknown): value is Omit<ReadyLicenseState, 'status'> {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return typeof candidate.authorizationId === 'string'
    && authorizationIdPattern.test(candidate.authorizationId)
    && candidate.notice === requiredNotice
}

export async function loadLicense(fetchImpl: typeof fetch = fetch): Promise<LicenseState> {
  try {
    const response = await fetchImpl('/license.json', { cache: 'no-store' })
    const value: unknown = response.ok ? await response.json() : null
    return isValidLicense(value)
      ? { status: 'ready', authorizationId: value.authorizationId, notice: value.notice }
      : { status: 'error' }
  } catch {
    return { status: 'error' }
  }
}
```

- [ ] **Step 4: Run the license tests to verify they pass**

Run: `npm run test:run -- src/license/license.test.ts`

Expected: 2 passing tests.

- [ ] **Step 5: Write the notice component failure test**

Create `web/src/components/LicenseNotice.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LicenseNotice } from './LicenseNotice'

describe('LicenseNotice', () => {
  it('shows the authorization ID and fixed usage restriction', () => {
    render(<LicenseNotice state={{
      status: 'ready',
      authorizationId: 'SZU-2026-001',
      notice: '仅授权个人学习使用，禁止转发、复制、售卖',
    }} />)

    expect(screen.getByLabelText('授权信息')).toHaveTextContent('授权编号：SZU-2026-001')
    expect(screen.getByLabelText('授权信息')).toHaveTextContent('仅授权个人学习使用，禁止转发、复制、售卖')
  })

  it('does not invent an ID if the authorization file cannot be loaded', () => {
    render(<LicenseNotice state={{ status: 'error' }} />)

    expect(screen.getByRole('alert')).toHaveTextContent('授权信息加载失败，请联系卖家')
  })
})
```

- [ ] **Step 6: Run the notice test to verify it fails**

Run: `npm run test:run -- src/components/LicenseNotice.test.tsx`

Expected: FAIL because `./LicenseNotice` does not exist.

- [ ] **Step 7: Implement the notice and its visual treatment**

Create `web/src/components/LicenseNotice.tsx`:

```tsx
import type { LicenseState } from '../license/license'
import './LicenseNotice.css'

export interface LicenseNoticeProps {
  state: LicenseState
}

export function LicenseNotice({ state }: LicenseNoticeProps) {
  if (state.status === 'error') {
    return <p className="license-notice license-notice-error" role="alert">授权信息加载失败，请联系卖家</p>
  }

  return (
    <aside aria-label="授权信息" className="license-notice">
      <strong>授权编号：{state.authorizationId}</strong>
      <span>{state.notice}</span>
    </aside>
  )
}
```

Create `web/src/components/LicenseNotice.css`:

```css
.license-notice {
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 38px;
  padding: 9px 16px;
  border-bottom: 1px solid #fde68a;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.82rem;
  line-height: 1.45;
  text-align: center;
}

.license-notice strong {
  color: #78350f;
}

.license-notice-error {
  margin: 0;
  border-bottom-color: #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

@media (max-width: 640px) {
  .license-notice {
    align-items: center;
    flex-direction: column;
    gap: 2px;
    padding: 7px 12px;
  }
}
```

- [ ] **Step 8: Mount the notice for every App screen and add the development fixture**

Create `web/public/license.json`:

```json
{
  "authorizationId": "DEV-LOCAL-ONLY",
  "notice": "仅授权个人学习使用，禁止转发、复制、售卖"
}
```

In `web/src/App.tsx`, import `useEffect`, type-only `ReactNode`, `LicenseNotice`, `LicenseState`, and `loadLicense`; initialize `const [licenseState, setLicenseState] = useState<LicenseState>({ status: 'error' })`; load it once with:

```ts
useEffect(() => {
  void loadLicense().then(setLicenseState)
}, [])
```

Add this local wrapper before the first screen branch:

```tsx
function withLicense(content: ReactNode) {
  return <><LicenseNotice state={licenseState} />{content}</>
}
```

Wrap each of the seven existing branches (`practice`, `subjective`, `topics`, `cloze`, `reading`, `translation`, `writing`) and the dashboard return with `withLicense(...)`.

In `web/vite.config.ts`, add the PWA Workbox option:

```ts
globIgnores: ['**/license.json'],
```

inside the existing `workbox` object, so a staged buyer package always fetches its own root `license.json`.

- [ ] **Step 9: Add a cross-screen application test**

Change the Vitest import in `web/src/App.test.tsx` to `import { afterEach, describe, expect, it, vi } from 'vitest'`, add `afterEach(() => vi.unstubAllGlobals())` immediately inside `describe('App', () => {`, and append this test:

```tsx
it('keeps the authorization notice visible after entering a practice screen', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
    authorizationId: 'SZU-2026-001',
    notice: '仅授权个人学习使用，禁止转发、复制、售卖',
  }), { status: 200 })))
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: '开始练习' }))

  expect(await screen.findByLabelText('授权信息')).toHaveTextContent('仅授权个人学习使用，禁止转发、复制、售卖')
})
```

- [ ] **Step 10: Run browser tests and commit the authorization UI**

Run: `npm run test:run -- src/license/license.test.ts src/components/LicenseNotice.test.tsx src/App.test.tsx`

Expected: all named suites pass. Then run `npm run lint` and `npm run build`; expected exit code is 0 for both.

Commit:

```powershell
git add -- web/public/license.json web/src/license web/src/components/LicenseNotice.tsx web/src/components/LicenseNotice.css web/src/components/LicenseNotice.test.tsx web/src/App.tsx web/src/App.test.tsx web/vite.config.ts
git commit -m "feat: show personal authorization notice"
```

### Task 2: Create and test the buyer's restricted local server

**Files:**
- Create: `tools/authorization-package/server.mjs`
- Create: `tools/authorization-package/server.test.mjs`

**Interfaces:**
- Consumes: `createAuthorizedServer({ packageRoot, host, port })` options.
- Produces: `createAuthorizedServer(options): Promise<{ server: import('node:http').Server; url: string }>` and CLI execution via `node server.mjs --open`.

- [ ] **Step 1: Write the server integration test**

Create a temporary package root containing `site/index.html`, `site/assets/app.js`, and root `license.json`. Test these requests after starting the exported server on `127.0.0.1` port `0`:

```js
assert.equal((await fetch(`${url}/`)).status, 200)
assert.match(await (await fetch(`${url}/`)).text(), /study site/)
assert.equal((await fetch(`${url}/license.json`)).status, 200)
assert.equal((await fetch(`${url}/missing-route`)).status, 200)
assert.equal((await fetch(`${url}/..%2Fserver.mjs`)).status, 403)
assert.equal((await fetch(`${url}/`, { method: 'POST' })).status, 405)
```

The test must close the server and delete its unique temporary directory in `finally`.

- [ ] **Step 2: Run the server test to verify it fails**

Run: `node --test tools/authorization-package/server.test.mjs`

Expected: FAIL because `server.mjs` does not exist.

- [ ] **Step 3: Implement the constrained HTTP server**

Implement `createAuthorizedServer` in `tools/authorization-package/server.mjs` using `node:http`, `node:fs/promises`, `node:path`, `node:url`, and `node:os`. The implementation must:

```js
const allowedMethods = new Set(['GET', 'HEAD'])
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.webmanifest', 'application/manifest+json; charset=utf-8'],
])
```

For every pathname, call `decodeURIComponent`, reject decoding errors with `400`, and use `path.relative(siteRoot, candidate)` to reject candidates whose relative path starts with `..` or is absolute. Map `/license.json` only to `path.join(packageRoot, 'license.json')`; map `/` to `site/index.html`; map a missing extensionless request to the same SPA entry. Existing files use their extension MIME type and `Cache-Control: no-store` for `license.json`. Return `404` for missing files with an extension, `403` for a traversal attempt, and `405` for a non-GET/HEAD method.

When run directly, listen on `0.0.0.0:4173`, print `本机地址：http://127.0.0.1:4173/` plus every non-internal IPv4 LAN address from `networkInterfaces()`, and when `--open` is present launch the local URL with `cmd.exe /c start "" <url>` after listen succeeds.

- [ ] **Step 4: Run the server test to verify it passes**

Run: `node --test tools/authorization-package/server.test.mjs`

Expected: 1 passing test with all five HTTP assertions satisfied.

- [ ] **Step 5: Commit the buyer server**

```powershell
git add -- tools/authorization-package/server.mjs tools/authorization-package/server.test.mjs
git commit -m "feat: add restricted buyer local server"
```

### Task 3: Build a tested seller packager and the double-click entry point

**Files:**
- Create: `tools/authorization-package/package-lib.mjs`
- Create: `tools/authorization-package/package-lib.test.mjs`
- Create: `tools/authorization-package/generate-package.mjs`
- Create: `启动学位英语题库.template.cmd`
- Create: `生成个人授权包.cmd`
- Create: `授权包输出/.gitkeep`
- Modify: `web/package.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `createAuthorizedPackage({ authorizationId, password, outputRoot, projectRoot, run, now })` where `run(command, args, options)` returns `{ stdout, stderr }` or throws.
- Produces: `{ archivePath, sha256, ledgerPath }`, a staged folder named `深大学位英语_个人授权_<authorizationId>`, and archive name `深大学位英语_个人授权_<authorizationId>.7z`.

- [ ] **Step 1: Write pure generator tests before implementation**

Create `tools/authorization-package/package-lib.test.mjs` with tests that:

1. expect `validateAuthorizationId('SZU-2026_001')` to return the ID;
2. expect invalid values `''`, `'AB'`, `'SZU 001'`, `'SZU/001'`, and `'a'.repeat(65)` to throw `授权编号只能包含字母、数字、连字符和下划线，长度为 3–64 个字符。`;
3. create a temporary fake build directory containing `index.html`, `assets/app.js`, and `license.json`, then call the staging function and assert the resulting directory has exactly `node.exe`, `server.mjs`, `license.json`, `启动学位英语题库.cmd`, `个人学习授权说明.txt`, `使用说明.txt`, and `site`; assert `site/license.json` is absent;
4. use an injected fake `run` function and assert its 7-Zip arguments include `a`, `-t7z`, `-mhe=on`, and exactly one `-p<password>` argument; assert the password does not occur in the generated license, Chinese instruction content, or ledger;
5. assert the ledger line parses as JSON and has `generatedAt`, `authorizationId`, `fileName`, and a 64-character lowercase `sha256` field.

- [ ] **Step 2: Run the packager tests to verify they fail**

Run: `node --test tools/authorization-package/package-lib.test.mjs`

Expected: FAIL because `package-lib.mjs` does not exist.

- [ ] **Step 3: Implement the packager library with an explicit allowlist**

In `tools/authorization-package/package-lib.mjs`, export these exact functions:

```js
export { validateAuthorizationId, createLicense, stageBuyerPackage, createAuthorizedPackage }
```

`stageBuyerPackage` must copy only `web/dist` files into `site/`, remove `site/license.json`, copy `process.execPath` to `node.exe`, copy `tools/authorization-package/server.mjs`, and write a package-root `license.json` using `JSON.stringify(createLicense(id), null, 2) + '\n'`. It must replace `<AUTHORIZATION_ID>` in `启动学位英语题库.template.cmd`, and write both Chinese documents from fixed string constants:

```text
个人学习授权说明

授权编号：<AUTHORIZATION_ID>
仅授权个人学习使用，禁止转发、复制、售卖

本产品仅限获得授权的个人学习使用。不得将本压缩包、解压后的程序、题库内容或其复制件转发、复制、出租、出售或用于其他商业用途。
```

```text
使用说明

1. 使用卖家单独发送的密码，用 7-Zip 或 Bandizip 解压本文件。
2. 双击“启动学位英语题库.cmd”。请保持弹出的窗口打开。
3. 浏览器会自动打开学习网站；同一可信 Wi-Fi 下的平板可访问窗口显示的局域网地址。
4. 请勿在公共网络中允许防火墙访问，也不要向他人转发此授权包或密码。
```

`createAuthorizedPackage` must call `npm run build` in `web/`, find `7z.exe` first from `SEVEN_ZIP_PATH`, then `C:\Program Files\7-Zip\7z.exe`, then `C:\Program Files (x86)\7-Zip\7z.exe`, and throw `未找到 7-Zip 命令行工具。请安装 7-Zip 后重试。` if none exists. It must run:

```text
7z.exe a -t7z -mhe=on -p<password> <archivePath> <packageDirectory>\*
```

After archive creation, calculate SHA-256 with `crypto.createHash('sha256')`, append one JSON line to `授权包输出/授权交付清单.jsonl`, and use `finally` to remove the temporary staging directory and partial archive after any failure. Never print the password.

- [ ] **Step 4: Add the interactive generator and two CMD files**

`tools/authorization-package/generate-package.mjs` must prompt `授权编号：`, then masked `压缩包密码：` and `再次输入密码：`. It must exit with code 1 if passwords are empty or unequal, call `createAuthorizedPackage`, and print only the archive path, authorization ID, SHA-256, and `请通过与压缩包不同的渠道发送密码。`.

Implement masked prompts with `process.stdin.setRawMode(true)`, showing `*` for ordinary password characters, erasing one `*` on backspace, and restoring raw mode in a `finally` block. Do not use `console.log` on either password value.

Create `启动学位英语题库.template.cmd`:

```bat
@echo off
setlocal
cd /d "%~dp0"
title 深大学位英语个人授权版
echo.
echo 授权编号：<AUTHORIZATION_ID>
echo 仅授权个人学习使用，禁止转发、复制、售卖
echo.
"%~dp0node.exe" "%~dp0server.mjs" --open
echo.
echo 服务已停止。请关闭本窗口或按任意键退出。
pause >nul
```

Create `生成个人授权包.cmd`:

```bat
@echo off
setlocal
cd /d "%~dp0"
node "%~dp0tools\authorization-package\generate-package.mjs"
set "exitCode=%errorlevel%"
echo.
if not "%exitCode%"=="0" echo 未生成授权包，请阅读上方提示后重试。
pause
exit /b %exitCode%
```

Add `.gitignore` entries:

```gitignore
# Generated personal-authorization releases and seller records.
授权包输出/*
!授权包输出/.gitkeep
```

Add this package script to `web/package.json`:

```json
"test:package": "node --test ../tools/authorization-package/*.test.mjs"
```

- [ ] **Step 5: Run focused package tests and commit**

Run: `npm run test:package`

Expected: all package-library and server tests pass.

Commit:

```powershell
git add -- tools/authorization-package 生成个人授权包.cmd 启动学位英语题库.template.cmd 授权包输出/.gitkeep .gitignore web/package.json
git commit -m "feat: add encrypted personal package generator"
```

### Task 4: Document, generate, and prove one AES-256 buyer package

**Files:**
- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-09-06-personal-authorized-package.md`
- Create outside Git: `I:\codexoutput\文档\深大学位英语授权包\深大学位英语_个人授权_<授权编号>.7z`

**Interfaces:**
- Consumes: the double-click generator, a seller-chosen nonempty authorization ID, and a password sent separately from the archive.
- Produces: a real encrypted archive whose buyer directory starts and serves the licensed site.

- [ ] **Step 1: Write the seller and buyer operating guide**

Append a `个人授权包（卖家操作）` section to `README.md` covering these exact facts: install 7-Zip on the seller machine; double-click `生成个人授权包.cmd`; record the generated authorization ID and SHA-256 with the buyer order outside the package; send the archive and password through separate channels; buyers need a `.7z` extraction tool, then double-click the launch script; the app is LAN-only and browser data remains local to each device; AES-256, watermark, and ID improve deterrence and traceability but cannot technically prevent screenshots or copied files after decryption.

- [ ] **Step 2: Verify all project checks before the live archive**

Run in `web/`:

```powershell
npm run test:run
npm run test:package
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

Expected: every command exits 0. Record any count changes in the final handoff; do not claim success without command output.

- [ ] **Step 3: Ensure the seller has the official 7-Zip CLI**

Verify one of these paths exists before generation:

```text
C:\Program Files\7-Zip\7z.exe
C:\Program Files (x86)\7-Zip\7z.exe
```

If neither path exists, install 7-Zip from its official distribution on the seller environment, then rerun `7z.exe i` and confirm it reports a 7-Zip version. Do not copy this tool into the buyer package.

- [ ] **Step 4: Create an authorization package without disclosing its password in the project**

Double-click `生成个人授权包.cmd`, enter a valid seller-chosen authorization ID and a nonempty password. The generator writes to `授权包输出/`. Copy only the completed archive into `I:\codexoutput\文档\深大学位英语授权包\`; do not copy the ledger or staging directory. The password must remain solely with the seller and be sent outside the archive.

- [ ] **Step 5: Prove archive encryption and buyer contents**

Use `7z l -slt <archivePath>` and `7z t -p<known-password> <archivePath>` to verify listing and integrity. Attempt `7z t -p<wrong-password> <archivePath>` and require a nonzero exit. Extract the correct-password archive to a fresh temporary directory and assert it includes only the seven allowed root entries and `site/`, has no `node_modules`, source `.ts/.tsx` files, generator, password, or ledger.

- [ ] **Step 6: Prove buyer startup and visible authorization**

Start the extracted buyer launch script, make an HTTP request to `http://127.0.0.1:4173/license.json` and the browser landing page, and require HTTP 200. Open the landing page in Microsoft Edge and inspect that the exact authorization ID and fixed notice are visible. Navigate to an objective practice session and a subjective exercise to prove the notice remains visible. Stop the server cleanly after verification.

- [ ] **Step 7: Update completion state and commit documentation**

Mark only the completed checkboxes in this plan. Commit the README and plan update:

```powershell
git add -- README.md docs/superpowers/plans/2026-09-06-personal-authorized-package.md
git commit -m "docs: explain personal authorization package"
```

Do not add a generated archive, buyer password, personal buyer data, or `授权交付清单.jsonl` to Git.
