import { expect, test } from '@playwright/test'

test('桌面端固定批次、已掌握浏览和完成后继续背诵', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-edge')
  await page.goto('/')
  await expect(page.getByLabel('考试倒计时')).toHaveCount(0)

  await page.getByRole('button', { name: '单词速记' }).click()
  await expect(page.getByRole('dialog', { name: '设置本次背诵目标' })).toBeVisible()
  await expect(page.getByRole('list', { name: '单词列表' })).toHaveCount(0)
  await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
  await page.getByRole('button', { name: '开背' }).click()
  await expect(page.getByRole('list', { name: '单词列表' }).getByRole('listitem')).toHaveCount(2)

  await page.getByRole('button', { name: '已掌握 ability' }).click()
  await expect(page.getByText('able', { exact: true })).toBeVisible()
  await expect(page.getByText('book', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '已掌握单词' }).click()
  await expect(page.getByText('ability', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '返回本轮单词' }).click()
  await expect(page.getByText('able', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '已掌握 able' }).click()
  await expect(page.getByRole('dialog', { name: '本轮背诵完成' })).toBeVisible()
  await expect(page.getByText('建议劳逸结合，不要急功近利哦～')).toBeVisible()
  await page.getByRole('button', { name: '继续背' }).click()
  await expect(page.getByRole('dialog', { name: '设置本次背诵目标' })).toBeVisible()
})

test('快速连续点击时仅最后一个单词进入播放状态', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-edge')
  const pageErrors: string[] = []
  const audioResponses = new Map<string, { status: number, contentType: string }>()
  page.on('pageerror', (error) => pageErrors.push(error.message))
  page.on('response', (response) => {
    const pathname = new URL(response.url()).pathname
    if (pathname.endsWith('/audio/words/0001.mp3') || pathname.endsWith('/audio/words/0002.mp3')) {
      audioResponses.set(pathname, {
        status: response.status(),
        contentType: response.headers()['content-type'] ?? '',
      })
    }
  })

  await page.goto('/')
  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
  await page.getByRole('button', { name: '开背' }).click()
  await expect.poll(() => audioResponses.get('/audio/words/0001.mp3')?.status).toBe(200)
  await expect.poll(() => audioResponses.get('/audio/words/0002.mp3')?.status).toBe(200)
  expect(audioResponses.get('/audio/words/0001.mp3')?.contentType).toContain('audio/mpeg')
  expect(audioResponses.get('/audio/words/0002.mp3')?.contentType).toContain('audio/mpeg')

  await page.getByRole('button', { name: '播放 ability 的美式发音' }).click()
  await page.getByRole('button', { name: '播放 able 的美式发音' }).click()
  await expect(page.getByRole('button', { name: '正在播放 able 的美式发音' })).toBeVisible()
  await expect(page.getByRole('button', { name: '正在播放 ability 的美式发音' })).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('平板窄屏首字母确认、释义提示和休息返回', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-edge')
  await page.goto('/')

  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
  await page.getByRole('button', { name: '开背' }).click()
  await page.getByRole('button', { name: '按首字母' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByText('请选择下方具体字母')).toBeVisible()
  await page.getByRole('button', { name: '字母 Z' }).click()
  await expect(page.getByRole('dialog', { name: '重新生成本轮单词？' })).toBeVisible()
  await expect(page.getByText('当前最多可提供1个。')).toBeVisible()
  await page.getByRole('button', { name: '取消' }).click()
  await expect(page.getByRole('list', { name: '单词列表' }).getByRole('listitem')).toHaveCount(2)
  await expect(page.getByText('ability', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '字母 Z' }).click()
  await page.getByRole('button', { name: '确认重新生成' }).click()
  await expect(page.getByText('zero', { exact: true })).toBeVisible()
  await expect(page.getByText('本轮目标 1 · 剩余 1')).toBeVisible()

  const zeroDefinition = page.getByRole('button', { name: '切换 zero 的释义显示' })
  await expect(zeroDefinition).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('button', { name: '点击可隐藏 zero 的中文释义' })).toHaveText('点击可隐藏中文释义')
  await zeroDefinition.click()
  await expect(zeroDefinition).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: '点击可展示 zero 的中文释义' })).toHaveText('点击可展示中文释义')
  await page.getByRole('button', { name: '点击可展示 zero 的中文释义' }).click()
  await expect(zeroDefinition).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('button', { name: '点击可隐藏 zero 的中文释义' })).toHaveText('点击可隐藏中文释义')

  const backButton = page.getByRole('button', { name: '返回今日学习' })
  await expect(backButton).toBeVisible()
  const box = await backButton.boundingBox()
  expect(box).not.toBeNull()
  expect(box?.x).toBeLessThan(24)

  await page.getByRole('button', { name: '已掌握 zero' }).click()
  await expect(page.getByRole('dialog', { name: '本轮背诵完成' })).toBeVisible()
  await page.getByRole('button', { name: '先休息一下' }).click()
  await expect(page.getByRole('heading', { name: '今日学习' })).toBeVisible()
})

test('窄屏和两栏临界宽度都不会裁切掌握按钮', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-edge')
  await page.setViewportSize({ width: 580, height: 900 })
  await page.goto('/')

  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByRole('spinbutton', { name: '本次背诵数量目标' }).fill('2')
  await page.getByRole('button', { name: '开背' }).click()

  async function expectMasteryButtonInsidePanel() {
    const panel = await page.locator('.word-list-panel').boundingBox()
    const button = page.getByRole('button', { name: '已掌握 ability' })
    const buttonBox = await button.boundingBox()
    expect(panel).not.toBeNull()
    expect(buttonBox).not.toBeNull()
    expect(buttonBox!.x).toBeGreaterThanOrEqual(panel!.x)
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(panel!.x + panel!.width)
    await expect(button).toBeVisible()
  }

  await expectMasteryButtonInsidePanel()
  await page.setViewportSize({ width: 861, height: 900 })
  await expectMasteryButtonInsidePanel()
})
