import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 412, height: 915 }, isMobile: true })

test('手机端可保存并恢复汉译英草稿', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: '选择专题' }).click()
  await page.getByRole('button', { name: '基础句序与主谓一致 · 10 句' }).click()

  const draft = page.getByRole('textbox', { name: '我的译文' })
  await draft.fill('I get up at seven every morning.')
  await page.getByRole('button', { name: '保存草稿' }).click()

  await page.goto('/')
  await page.getByRole('button', { name: '选择专题' }).click()
  await page.getByRole('button', { name: '基础句序与主谓一致 · 10 句' }).click()

  await expect(page.getByRole('textbox', { name: '我的译文' })).toHaveValue('I get up at seven every morning.')
})
