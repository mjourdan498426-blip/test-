import { defineConfig, devices } from '@playwright/test'

// Chromium préinstallé : PLAYWRIGHT_CHROMIUM_PATH permet de pointer un binaire existant.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined

const mobile = (width: number, height: number) => ({
  ...devices['Pixel 7'],
  viewport: { width, height },
  launchOptions: { executablePath },
})

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173', locale: 'fr-FR' },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'mobile-360', use: mobile(360, 740) },
    { name: 'mobile-390', use: mobile(390, 844) },
    { name: 'mobile-430', use: mobile(430, 932) },
  ],
})
