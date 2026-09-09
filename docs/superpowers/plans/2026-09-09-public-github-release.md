# Public GitHub Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the validated personal-authorization edition on this computer while making GitHub `main` a public, no-authorization edition with a downloadable Windows one-click package and a `v1.0.0` GitHub Release.

**Architecture:** A local-only branch pins the existing personal-authorization implementation. A separate public-release worktree removes authorization-specific UI and tooling from its branch, adds a generic static-server package builder, then merges the verified result into `main`. The release ZIP contains only a bundled Node runtime, a restricted static server, the production `site/`, a launcher, and user instructions.

**Tech Stack:** React 19, TypeScript, Vite/PWA, Vitest, Playwright with Microsoft Edge, Node.js built-in modules, 7-Zip CLI, GitHub CLI.

## Global Constraints

- Keep the existing GitHub history; never force-push or rewrite `origin/main`.
- Create `codex/personal-authorization-v1` at `9f39a2154ef0223defd4cdb0d7f5d172d8b52164`; do not set an upstream or push that branch.
- The public edition must not contain a personal authorization ID, `license.json`, seller prompt, encryption/password flow, seller ledger, or personal-authorization packaging source.
- The public release asset is unencrypted `深大学位英语题库_公开版_v1.0.0.zip` and is built for 64-bit Windows users who can double-click a `.cmd` file.
- The release must retain local-only browser storage, trusted-LAN tablet access, and the existing 780-question study experience.
- The generated ZIP and temporary staging files stay ignored by Git; only public source, tests, documentation, and release notes are committed.

---

## File Structure

| Path | Responsibility |
| --- | --- |
| `web/src/components/PublicEditionNotice.tsx` | Renders the neutral public-edition banner. |
| `web/src/components/PublicEditionNotice.css` | Styles the public-edition banner using the existing sticky banner pattern. |
| `web/src/components/PublicEditionNotice.test.tsx` | Verifies public copy has no personal authorization semantics. |
| `web/src/App.tsx` | Replaces asynchronous authorization loading and its wrapper with the public-edition banner. |
| `web/src/license/*` | Removed from the public branch; retained on the local-only personal branch. |
| `web/public/license.json` | Removed from the public branch. |
| `tools/public-release/server.mjs` | Restricted static-file server used by the public ZIP. |
| `tools/public-release/server.test.mjs` | Node integration coverage for allowed files, SPA fallback, traversal rejection, and unsupported methods. |
| `tools/public-release/package-lib.mjs` | Builds and stages the generic release directory, writes instructions, produces an unencrypted ZIP, and calculates SHA-256. |
| `tools/public-release/package-lib.test.mjs` | Tests generated file allowlist, archive arguments, collision handling, and password-free output. |
| `tools/public-release/generate-package.mjs` | Seller-maintainer CLI that creates the fixed `v1.0.0` public ZIP. |
| `生成公开版发布包.cmd` | Double-click entry point for the public ZIP builder. |
| `启动公开版题库.template.cmd` | Template copied into the public ZIP as `启动学位英语题库.cmd`. |
| `发布包输出/.gitkeep` | Keeps the otherwise ignored public-release output directory. |
| `.gitignore` | Ignores public-release archives, manifests, and staging directories. |
| `web/package.json` | Adds the public packager test script. |
| `web/README.md` | Documents the public edition, public ZIP generation, and its local-data/LAN boundaries. |
| `docs/release-notes/v1.0.0.md` | GitHub Release title/body and Windows usage instructions. |

### Task 1: Isolate the Personal-Authorization Baseline and Create the Public Worktree

**Files:**
- Create: no source file; create the local Git branch and worktree below.

**Interfaces:**
- Consumes: personal-authorized commit `9f39a2154ef0223defd4cdb0d7f5d172d8b52164` and planning commit `fc5acaccf16ac940fdcac9d14916a1609ea7c46e`.
- Produces: local-only `codex/personal-authorization-v1` and isolated `codex/public-release-v1` worktree.

- [ ] **Step 1: Verify the private baseline is a reachable local commit**

Run:

```powershell
git cat-file -e 9f39a2154ef0223defd4cdb0d7f5d172d8b52164^{commit}
git show --quiet --format=%s 9f39a2154ef0223defd4cdb0d7f5d172d8b52164
```

Expected: the command succeeds and prints `fix: stabilize license loading and browser checks`.

- [ ] **Step 2: Create the never-pushed personal edition branch**

Run from `I:\CodexProjects\学位英语攻关`:

```powershell
git branch --no-track codex/personal-authorization-v1 9f39a2154ef0223defd4cdb0d7f5d172d8b52164
```

Expected: `git branch -vv` shows the branch at `9f39a21` with no `origin/...` tracking reference.

- [ ] **Step 3: Create an isolated public-release worktree from current local main**

Run:

```powershell
git worktree add -b codex/public-release-v1 I:\CodexProjects\学位英语攻关\.worktrees\public-release-v1 main
```

Expected: the new worktree is on `codex/public-release-v1` at `fc5acac`; the root worktree remains on `main`.

- [ ] **Step 4: Verify the worktree boundary before changing source**

Run:

```powershell
git -C I:\CodexProjects\学位英语攻关\.worktrees\public-release-v1 status --short --branch
git -C I:\CodexProjects\学位英语攻关 status --short --branch
```

Expected: both are clean; the first is `## codex/public-release-v1`, the second is `## main...origin/main [ahead 1]`.

- [ ] **Step 5: Install the isolated public worktree's pinned build dependencies**

Run from `I:\CodexProjects\学位英语攻关\.worktrees\public-release-v1\web`:

```powershell
npm ci
```

Expected: `node_modules/.bin/vitest`, `node_modules/.bin/tsx`, and `node_modules/.bin/vite` are present. This installs only ignored local dependencies and does not alter `package-lock.json`.

### Task 2: Replace Personal Authorization UI with a Public Edition Notice

**Files:**
- Create: `web/src/components/PublicEditionNotice.tsx`
- Create: `web/src/components/PublicEditionNotice.css`
- Create: `web/src/components/PublicEditionNotice.test.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/App.test.tsx`
- Delete: `web/src/components/LicenseNotice.tsx`
- Delete: `web/src/components/LicenseNotice.css`
- Delete: `web/src/components/LicenseNotice.test.tsx`
- Delete: `web/src/license/license.ts`
- Delete: `web/src/license/license.test.ts`
- Delete: `web/src/license/license-state.ts`
- Delete: `web/src/license/license-state.test.ts`
- Delete: `web/public/license.json`

**Interfaces:**
- Consumes: the existing `App` screen wrapper and current sticky notice visual language.
- Produces: `<PublicEditionNotice />`, which has no props and is rendered once above every app screen.

- [ ] **Step 1: Write the failing component test**

Create `web/src/components/PublicEditionNotice.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PublicEditionNotice } from './PublicEditionNotice'

describe('PublicEditionNotice', () => {
  it('shows a neutral public-use notice without authorization semantics', () => {
    render(<PublicEditionNotice />)

    const notice = screen.getByLabelText('公开版提示')
    expect(notice).toHaveTextContent('公开学习版 · 免费使用')
    expect(notice).not.toHaveTextContent('授权')
    expect(notice).not.toHaveTextContent('卖家')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails because the component does not exist**

Run from `web/` in the public worktree:

```powershell
npm run test:run -- --run src/components/PublicEditionNotice.test.tsx
```

Expected: FAIL with an unresolved `./PublicEditionNotice` import.

- [ ] **Step 3: Implement the minimal public notice component and style**

Create `web/src/components/PublicEditionNotice.tsx`:

```tsx
import './PublicEditionNotice.css'

export function PublicEditionNotice() {
  return <aside aria-label="公开版提示" className="public-edition-notice">公开学习版 · 免费使用</aside>
}
```

Create `web/src/components/PublicEditionNotice.css` by retaining the existing `.license-notice` layout declarations but renaming the class to `.public-edition-notice`; remove the error-only selectors and use the existing amber border/background/text palette.

In `web/src/App.tsx`, remove `useEffect`, `loadLicense`, `LicenseState`, `applyLicenseState`, and the `licenseState` state. Replace the `LicenseNotice` import with `PublicEditionNotice`, then make the wrapper exact:

```tsx
function withEditionNotice(content: ReactNode) {
  return <><PublicEditionNotice />{content}</>
}
```

Replace every `withLicense(` call with `withEditionNotice(`. Delete the obsolete license files and `web/public/license.json` listed above.

- [ ] **Step 4: Update the application-level assertion and verify the test suite**

In `web/src/App.test.tsx`, add an assertion to the dashboard render test:

```tsx
expect(screen.getByLabelText('公开版提示')).toHaveTextContent('公开学习版 · 免费使用')
```

Run:

```powershell
npm run test:run -- --run src/components/PublicEditionNotice.test.tsx src/App.test.tsx
```

Expected: PASS with no React `act(...)` warning.

- [ ] **Step 5: Commit the public UI conversion**

Run:

```powershell
git add web/src/App.tsx web/src/App.test.tsx web/src/components/PublicEditionNotice.tsx web/src/components/PublicEditionNotice.css web/src/components/PublicEditionNotice.test.tsx web/src/components/LicenseNotice.tsx web/src/components/LicenseNotice.css web/src/components/LicenseNotice.test.tsx web/src/license web/public/license.json
git commit -m "feat: show public edition notice"
```

Expected: one commit containing only the public notice conversion and authorization-source removal.

### Task 3: Add a Restricted Static Server for the Public ZIP

**Files:**
- Create: `tools/public-release/server.mjs`
- Create: `tools/public-release/server.test.mjs`

**Interfaces:**
- Consumes: a package root containing only `site/` and public runtime files.
- Produces: `createPublicServer({ packageRoot, host?, port? })`, resolving to `{ server, url }`; running the module directly starts a trusted-LAN server and accepts `--open`.

- [ ] **Step 1: Write failing integration tests for public-server restrictions**

Create `tools/public-release/server.test.mjs` with a temporary package fixture containing `site/index.html` and `site/assets/app.js`. Test these exact cases:

```js
const instance = await createPublicServer({ packageRoot: fixture.root, host: '127.0.0.1', port: 0 })
await assertHttp(instance.url, '/', 200, '<main>公开题库</main>')
await assertHttp(instance.url, '/unknown-route', 200, '<main>公开题库</main>')
await assertHttp(instance.url, '/assets/app.js', 200, 'console.log("ok")')
await assertHttp(instance.url, '/../server.mjs', 403)
await assertHttp(instance.url, '/', 405, '', { method: 'POST' })
```

Use `fetch`, `afterEach` cleanup, and `server.close()` so every test releases its port.

- [ ] **Step 2: Run the server tests and verify they fail**

Run:

```powershell
node --test tools/public-release/server.test.mjs
```

Expected: FAIL because `tools/public-release/server.mjs` is absent.

- [ ] **Step 3: Implement the public server without a license route or authorization output**

Create `tools/public-release/server.mjs` with the same request safety rules as the current package server, but no `license.json` route. Its public interface and route decisions must be exactly:

```js
export async function createPublicServer({ packageRoot, host = '0.0.0.0', port = 4173 }) {
  const resolvedPackageRoot = resolve(packageRoot)
  const siteRoot = resolve(resolvedPackageRoot, 'site')
  // GET and HEAD only: otherwise respond 405 with Allow: GET, HEAD.
  // Decode the URL path once; malformed encodings respond 400.
  // `/` maps to site/index.html; other paths resolve under siteRoot only.
  // A resolved path outside siteRoot responds 403.
  // Existing files return their MIME type; missing paths with an extension respond 404.
  // Missing extensionless paths return site/index.html for React routing.
  // Bind to the requested host/port and return { server, url } with the actual bound port.
}
```

The CLI must print only the local URL, any trusted-LAN URLs, and `公开学习版已启动。`; it must never read or log `license.json`, an authorization ID, a seller message, or an anti-forwarding restriction.

- [ ] **Step 4: Run the server tests and verify they pass**

Run:

```powershell
node --test tools/public-release/server.test.mjs
```

Expected: all public-server test cases PASS.

- [ ] **Step 5: Commit the public server**

Run:

```powershell
git add tools/public-release/server.mjs tools/public-release/server.test.mjs
git commit -m "feat: add public release server"
```

### Task 4: Build the Password-Free Public ZIP Generator

**Files:**
- Create: `tools/public-release/package-lib.mjs`
- Create: `tools/public-release/package-lib.test.mjs`
- Create: `tools/public-release/generate-package.mjs`
- Create: `生成公开版发布包.cmd`
- Create: `启动公开版题库.template.cmd`
- Create: `发布包输出/.gitkeep`
- Modify: `.gitignore`
- Modify: `web/package.json`

**Interfaces:**
- Consumes: `web/dist`, `process.execPath`, `tools/public-release/server.mjs`, 7-Zip at `SEVEN_ZIP_PATH`, `C:\Program Files\7-Zip\7z.exe`, or `C:\Program Files (x86)\7-Zip\7z.exe`.
- Produces: `createPublicRelease({ outputRoot, projectRoot?, buildDirectory?, nodePath?, serverSourcePath?, launcherTemplatePath?, sevenZipPath?, run? })`, returning `{ archivePath, sha256 }` for a single fixed `v1.0.0` ZIP.

- [ ] **Step 1: Write failing packager tests**

Create `tools/public-release/package-lib.test.mjs`. Use a temporary fake build directory and injected `run` function. Assert that staging produces exactly these root entries:

```js
[
  'node.exe',
  'server.mjs',
  'site',
  '使用说明.txt',
  '启动学位英语题库.cmd',
]
```

Also assert that `site/license.json` does not exist, the launch script includes `node.exe` and `server.mjs`, the usage text includes `公开学习版`, and the injected 7-Zip arguments equal the important sequence:

```js
['a', '-tzip', archivePath, '深大学位英语题库_公开版_v1.0.0']
```

Assert no command argument begins with `-p`, no output filename contains an authorization ID, and a pre-existing archive causes `createPublicRelease` to reject with `公开版发布包已存在：<path>`.

- [ ] **Step 2: Run the packager tests and verify they fail**

Run:

```powershell
node --test tools/public-release/package-lib.test.mjs
```

Expected: FAIL because `package-lib.mjs` is absent.

- [ ] **Step 3: Implement staging, ZIP creation, and a double-click generator**

In `tools/public-release/package-lib.mjs`, define these fixed constants:

```js
const releaseVersion = '1.0.0'
const packageDirectoryName = `深大学位英语题库_公开版_v${releaseVersion}`
const archiveFileName = `${packageDirectoryName}.zip`
```

Implement `stagePublicRelease` to copy only `web/dist` into `site/`, remove any copied `site/license.json`, copy `process.execPath` as `node.exe`, copy the public server, create `启动学位英语题库.cmd` from the template, and write `使用说明.txt` with these numbered points:

```text
1. 解压本文件到任意本地文件夹。
2. 双击“启动学位英语题库.cmd”，并保持弹出的窗口打开。
3. 浏览器会自动打开公开学习版；同一可信 Wi-Fi 下的平板可访问窗口显示的局域网地址。
4. 学习记录、错题和草稿只保存在当前浏览器；请勿在公共 Wi-Fi 上开放局域网地址。
```

Implement `createPublicRelease` to build `web/` with `npm.cmd run build` on Windows, fail before overwriting an existing ZIP, run 7-Zip with `a -tzip`, calculate SHA-256, and always remove its temporary staging directory. It must not create a ledger, license file, password prompt, or encrypted archive.

Create `tools/public-release/generate-package.mjs` to call `createPublicRelease({ outputRoot: '发布包输出' })` and print only the archive path, SHA-256, and `公开版发布包生成完成。`.

Create `生成公开版发布包.cmd`:

```bat
@echo off
setlocal
cd /d "%~dp0"
node "%~dp0tools\public-release\generate-package.mjs"
set "exitCode=%errorlevel%"
echo.
if not "%exitCode%"=="0" echo The public release package was not created. Read the message above and try again.
pause
exit /b %exitCode%
```

Create `启动公开版题库.template.cmd` with the existing buyer-launcher structure but no authorization title or authorization console text; it must invoke `"%~dp0node.exe" "%~dp0server.mjs" --open`.

Add these exact ignore entries to `.gitignore`:

```gitignore
# Generated public release archives and temporary staging directories.
发布包输出/*
!发布包输出/.gitkeep
```

Add this script to `web/package.json`:

```json
"test:public-release": "node --test ../tools/public-release/*.test.mjs"
```

Keep `test:package` until Task 5 removes the private packager source and its script together.

- [ ] **Step 4: Run public packager tests and verify they pass**

Run:

```powershell
npm run test:public-release
```

Expected: all public packager and server tests PASS.

- [ ] **Step 5: Commit the public packager**

Run:

```powershell
git add tools/public-release 生成公开版发布包.cmd 启动公开版题库.template.cmd 发布包输出/.gitkeep .gitignore web/package.json
git commit -m "feat: add public release packager"
```

### Task 5: Make the Public Source Tree Free of Personal-Authorization Tooling

**Files:**
- Delete: `tools/authorization-package/`
- Delete: `生成个人授权包.cmd`
- Delete: `启动学位英语题库.template.cmd`
- Delete: `授权包输出/.gitkeep`
- Create: `tools/public-release/public-source-boundary.test.mjs`
- Modify: `web/README.md`
- Modify: `web/package.json`
- Create: `docs/release-notes/v1.0.0.md`

**Interfaces:**
- Consumes: the public notice and public packager from Tasks 2–4.
- Produces: a public README and GitHub Release body that do not describe a seller, a buyer, authorization IDs, passwords, or AES encryption.

- [ ] **Step 1: Add a failing static source-boundary test**

Create `tools/public-release/public-source-boundary.test.mjs`:

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

test('public source tree does not retain personal-authorization distribution files', () => {
  for (const relativePath of [
    'tools/authorization-package',
    '生成个人授权包.cmd',
    '启动学位英语题库.template.cmd',
    '授权包输出/.gitkeep',
  ]) {
    assert.equal(existsSync(join(projectRoot, relativePath)), false, `${relativePath} must not be public`)
  }
})
```

- [ ] **Step 2: Run the focused test and verify it fails before public staging is complete**

Run:

```powershell
npm run test:public-release
```

Expected: FAIL because the listed personal-authorization source files still exist in the public worktree.

- [ ] **Step 3: Delete private tooling and rewrite public documentation**

Delete the personal packager, its launcher/template, and its output placeholder listed above from the public worktree only. Replace the entire `## 个人授权包（卖家操作）` section of `web/README.md` with `## 公开版 Release 包（维护者操作）`, documenting:

```text
1. 发布电脑安装 Node.js、项目依赖和 7-Zip。
2. 双击项目根目录的“生成公开版发布包.cmd”。
3. 从“发布包输出”取得“深大学位英语题库_公开版_v1.0.0.zip”。
4. 仅将该 ZIP 上传到 GitHub Release；不要上传开发目录。
5. 用户解压后双击“启动学位英语题库.cmd”；数据仅存在本地浏览器，局域网仅限可信 Wi-Fi。
```

Remove the obsolete `"test:package"` entry from `web/package.json`; `test:public-release` is the only package-generator test command in the public source tree.

Create `docs/release-notes/v1.0.0.md` exactly with this public body:

```markdown
# 深圳大学学位英语 60 分攻关 v1.0.0

首个公开学习版，包含 780 道按题型与专题组织的原创练习内容。

## Windows 使用方式

1. 下载并解压 `深大学位英语题库_公开版_v1.0.0.zip`。
2. 双击解压目录中的 `启动学位英语题库.cmd`。
3. 保持启动窗口打开；浏览器会自动打开题库。
4. 如需在同一可信 Wi-Fi 的平板学习，请使用启动窗口显示的局域网地址。

学习记录、错题与草稿仅保存在各自浏览器中，不会在设备之间同步。请不要在公共 Wi-Fi 上开放局域网地址。
```

- [ ] **Step 4: Re-run public-packager tests and verify the allowlist passes**

Run:

```powershell
npm run test:public-release
```

Expected: PASS; the test proves the public source tree no longer retains personal-authorization distribution files.

- [ ] **Step 5: Commit the public-source boundary**

Run:

```powershell
git add -A tools/authorization-package 生成个人授权包.cmd 启动学位英语题库.template.cmd 授权包输出 web/README.md web/package.json docs/release-notes/v1.0.0.md tools/public-release/public-source-boundary.test.mjs
git commit -m "docs: prepare public release distribution"
```

### Task 6: Verify the Public Package and Publish GitHub Release v1.0.0

**Files:**
- Create outside Git: `发布包输出/深大学位英语题库_公开版_v1.0.0.zip`
- Create outside Git: a temporary extraction directory for inspection.
- Modify: GitHub `main` and GitHub Release metadata through normal non-force push and `gh release create`.

**Interfaces:**
- Consumes: verified public worktree, 7-Zip, existing `origin`, and authenticated GitHub CLI access to `yechun1993/English-lern`.
- Produces: public `main` and public GitHub `v1.0.0` Release asset.

- [ ] **Step 1: Run all automated checks in the public worktree**

Run each command from `web/` in the public worktree:

```powershell
npm run test:run -- --reporter=dot
npm run test:public-release
npm run validate:content
npm run lint
npm run build
npm run test:e2e
```

Expected: the front-end suite, public packager suite, content validation (780 questions), lint, production build, and two Edge workflows all PASS.

- [ ] **Step 2: Generate the public ZIP without a password**

From the public worktree root, double-click `生成公开版发布包.cmd` or run its exact underlying command:

```powershell
node tools/public-release/generate-package.mjs
```

Expected: `发布包输出/深大学位英语题库_公开版_v1.0.0.zip` exists and the console prints its SHA-256 with no password prompt.

- [ ] **Step 3: Inspect the ZIP allowlist and smoke-test extracted runtime**

Run:

```powershell
& 'C:\Program Files\7-Zip\7z.exe' l '发布包输出\深大学位英语题库_公开版_v1.0.0.zip'
```

Expected: only the public release directory, `site/`, `node.exe`, `server.mjs`, `启动学位英语题库.cmd`, and `使用说明.txt` appear; no `license.json`, `node_modules`, source `.ts`/`.tsx`, seller ledger, password prompt, or personal authorization file appears.

Extract to a unique temporary directory, launch its `启动学位英语题库.cmd`, request the displayed local URL, and verify HTTP 200 plus the public notice `公开学习版 · 免费使用`. Stop only the server process started for this smoke test afterward.

- [ ] **Step 4: Verify the clean public branch and merge it into main**

Run:

```powershell
git status --short
git diff --check
git -C I:\CodexProjects\学位英语攻关 merge --ff-only codex/public-release-v1
```

Expected: the public worktree is clean because Tasks 2–5 committed every source change; local `main` fast-forwards without rewriting history.

- [ ] **Step 5: Push main and create the public GitHub Release**

From the root worktree, first verify authentication and remote state:

```powershell
gh auth status
git push origin main
```

Then create the Release:

```powershell
gh release create v1.0.0 "I:\CodexProjects\学位英语攻关\.worktrees\public-release-v1\发布包输出\深大学位英语题库_公开版_v1.0.0.zip#深大学位英语题库_公开版_v1.0.0.zip" --repo yechun1993/English-lern --target main --title "深圳大学学位英语 60 分攻关 v1.0.0" --notes-file "I:\CodexProjects\学位英语攻关\.worktrees\public-release-v1\docs\release-notes\v1.0.0.md"
```

Expected: `gh release view v1.0.0 --repo yechun1993/English-lern` lists the public ZIP asset and its download URL.

- [ ] **Step 6: Verify remote main, release asset, and private-branch safety**

Run:

```powershell
git ls-remote --heads origin main
gh release view v1.0.0 --repo yechun1993/English-lern
git branch -vv
```

Expected: remote `main` points to the public-release merge commit; GitHub lists the ZIP asset; `codex/personal-authorization-v1` has no remote-tracking branch and remains at `9f39a21`.
