// @ts-check
const { devices } = require('@playwright/test');
const { permission } = require('process');

const config = {
  testDir: './tests',
  retries:1,
  workers:3,
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
  
    timeout: 5000
  },

  reporter:'html',
projects:[
  {
name: 'safari',
use: {
    browserName: 'webkit',
    headless: true,
    screenshot: 'off',
    trace: 'on',
    ...devices['iPhone 11']
  }
},
{
  name: 'chrome',
   use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    ignoreHttpsErrors:true,
    permissions:['geolocation'],
    trace: 'on',//off,on
    //...devices['']
    //viewport: {width:720,height:720}
  },
}
  

]

  ,//retain-on-failure

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  

};
module.exports=config
