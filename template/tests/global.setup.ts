import { test as setup, expect, test } from '@playwright/test';
// import { STORAGE_STATE } from '../playwright.config';

setup('Should setup Global', async ({ page }) => {
  // await page.goto('/');
  // await expect(page).toHaveTitle(/MindArc Integrations/);

  // Get session storage and store as env variable
  // const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
  // fs.writeFileSync('playwright/.auth/session.json', JSON.stringify(sessionStorage), 'utf-8');

  // Set session storage in a new context
  // const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
  // await context.addInitScript(storage => {
    // if (window.location.hostname === '127.0.0.1:92929') {
      // for (const [key, value] of Object.entries(storage))
        // window.sessionStorage.setItem(key, value);
    // }
  // }, sessionStorage);
  // await page.context().storageState({ path: STORAGE_STATE });
});
