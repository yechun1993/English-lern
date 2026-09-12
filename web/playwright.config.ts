import { defineConfig, devices } from '@playwright/test'

const previewPort = 48173

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: `http://127.0.0.1:${previewPort}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-edge',
      testMatch: ['learning-flow.spec.ts', 'word-quick-study.spec.ts'],
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'mobile-edge',
      testMatch: ['mobile-writing.spec.ts', 'word-quick-study.spec.ts'],
      use: { ...devices['Pixel 7'], channel: 'msedge' },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${previewPort} --strictPort`,
    url: `http://127.0.0.1:${previewPort}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
