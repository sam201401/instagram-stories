import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Where tests live
  timeout: 30000, // 30s per test
  retries: 1, // Retry failed tests once
  use: {
    baseURL: 'http://localhost:5173', // Vite dev server
    headless: true, // Run without UI by default
    viewport: { width: 375, height: 667 }, // Mobile size (iPhone)
  },
  webServer: {
    command: 'npm run dev', // Start Vite server
    port: 5173,
    reuseExistingServer: !process.env.CI, // Reuse dev server locally
  },
});