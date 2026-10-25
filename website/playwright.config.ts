import { defineConfig } from '@playwright/test';

const port = Number(process.env.PREVIEW_PORT || 4321);

export default defineConfig({
  testDir: './tests/browser',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, args: ['--no-sandbox'] },
  },
  webServer: {
    command: `ASTRO_TELEMETRY_DISABLED=1 npm run preview -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  },
});
