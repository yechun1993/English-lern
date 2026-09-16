import { expect, test } from '@playwright/test'

test('桌面端单词速记可播放、标记掌握并在已掌握筛选中恢复', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-edge')
  await page.goto('/')

  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByLabel('本次背诵数量').fill('2')
  await page.getByRole('button', { name: '确定数量' }).click()
  await expect(page.getByRole('list', { name: '单词列表' }).getByRole('listitem')).toHaveCount(2)

  await page.getByRole('button', { name: '播放 ability 的美式发音' }).click()
  await expect(page.getByTestId('word-audio')).toHaveAttribute('src', '/audio/words/0001.mp3')
  await page.getByRole('button', { name: '已掌握 ability' }).click()
  await expect(page.getByText('ability', { exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: '已掌握单词' }).click()
  await expect(page.getByText('ability', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: '取消掌握 ability' }).click()
  await expect(page.getByRole('heading', { name: '暂无符合条件的单词' })).toBeVisible()

  await page.getByRole('button', { name: '返回今日学习' }).click()
  await expect(page.getByRole('heading', { name: '今日学习' })).toBeVisible()
})

test('平板窄屏可按首字母定位、折叠释义并使用固定返回按钮', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-edge')
  await page.goto('/')

  await page.getByRole('button', { name: '单词速记' }).click()
  await page.getByRole('button', { name: '按首字母' }).click()
  await page.getByRole('button', { name: '字母 Z' }).click()
  await expect(page.getByText('zero', { exact: true })).toBeVisible()

  const zeroDefinition = page.getByRole('button', { name: '切换 zero 的释义显示' })
  await expect(zeroDefinition).toHaveAttribute('aria-expanded', 'true')
  await zeroDefinition.click()
  await expect(zeroDefinition).toHaveAttribute('aria-expanded', 'false')

  const backButton = page.getByRole('button', { name: '返回今日学习' })
  await expect(backButton).toBeVisible()
  const box = await backButton.boundingBox()
  expect(box).not.toBeNull()
  expect(box?.x).toBeLessThan(24)
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
