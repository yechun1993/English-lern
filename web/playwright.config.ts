import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-edge',
      testMatch: 'learning-flow.spec.ts',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'mobile-edge',
      testMatch: 'mobile-writing.spec.ts',
      use: { ...devices['Pixel 7'], channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
