// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config =({
  testDir: './tests',
  testMatch: '**/*.spec.{js,ts}',
  retries: 0,
  /*Maximum time one test can run for.*/
  timeout: 30*1000,
  expect: {
  timeout: 5000,
},
reporter:'html',
  use: {
    actionTimeout: 10*1000,
    navigationTimeout: 30*1000,
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',//retain-on-failure

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  },

});
module.exports=config
