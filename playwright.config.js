import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  use: {
    // Use localhost instead of file://
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Add more time for Alpine.js to initialize
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  reporter: [['html', { open: 'never' }]],
  // Run a local server before tests
  webServer: {
    command: 'npx http-server -p 8080 --silent',
    port: 8080,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
});