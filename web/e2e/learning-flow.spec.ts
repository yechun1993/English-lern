import { expect, test } from '@playwright/test'

test('桌面端可进入单题练习并在主动核对后查看解析', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: '开始练习' }).click()
  await expect(page.getByRole('heading', { name: '第 1 / 20 题' })).toBeVisible()

  await page.locator('.option-button').first().click()
  await page.getByRole('button', { name: '核对答案' }).click()

  await expect(page.locator('.answer-feedback')).toBeVisible()
  await expect(page.getByText('易错点：')).toBeVisible()
})
