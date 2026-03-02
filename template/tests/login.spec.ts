import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // await page.getByLabel('Password').fill('arcbridgetest');
  // await page.getByRole('button', { name: 'Enter' }).click();
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/MindArc Integrations/);
});


test('login page', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Enter store password').click();
  await page.getByLabel('Enter store password').fill('arcbridgetest');
  await page.getByRole('button', { name: 'Enter' }).click();

  const logoutButton = await page.$("text='Logout'");
  if (logoutButton) {
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    console.log('PLAYWRIGHT: Logout button exist, logging out first before proceeding with test.');
  } else {
    console.log('PLAYWRIGHT: No logout button found, proceeding to login.');
  }

  await page.getByRole('menuitem', { name: 'Login' }).click();

  await page.locator('#CustomerEmail').fill('thomask@mindarc.com.au');
  await page.locator('#CustomerPassword').fill('foobar');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await page.waitForURL('/account');

  await page.getByRole('menuitem', { name: 'Logout' }).click();
});
