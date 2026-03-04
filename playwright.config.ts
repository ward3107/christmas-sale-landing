import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for Security Regression Tests
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Run sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker to avoid overwhelming dev server
  timeout: 60 * 1000, // 60 second timeout per test
  reporter: [['html'], ['list']],
  use: {
    // Base URL for tests (can be overridden via PLAYWRIGHT_BASE_URL env var)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    // Collect trace on failure for debugging
    trace: 'on-first-retry',
    // Screenshot on failure
    screenshot: 'only-on-failure',
    // Navigate timeout
    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run dev server before tests (optional, for CI)
  // NOTE: webServer disabled for local testing - run `npm run dev` separately before tests
  // In CI, the webServer will be enabled
  webServer: process.env.CI ? {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  } : undefined,
});
