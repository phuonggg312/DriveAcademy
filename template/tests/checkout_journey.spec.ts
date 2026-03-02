import { test, expect } from '@playwright/test';

const runCheckoutProcess = false;

test('Should add a product to the cart and checkout', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('label:has-text("Enter store password")');
    await page.getByLabel('Enter store password').fill('arcbridgetest');
    await page.getByRole('button', { name: 'Enter' }).click();

    // TODO - Fix this (Seems to produce more consistent results than waiting instead of sticking to the store password page without css, i think this has to do with errors on the css network calls, for base page, maybe update to selector?)
    await page.waitForTimeout(3000);
    // await page.waitForURL('/');

    await page.getByRole('menuitem', { name: 'Collections' }).click();
    await page.waitForURL('/collections/all');

    // await expect(page).toHaveScreenshot('collections.png');
    // await page.screenshot({ path: 'tests/checkout/collections.png' });

    const productItem = page.locator("div.product-item").nth(2)
    await productItem.click();

    await page.locator("select").selectOption({ value: '43679211258009' });

    await page.getByRole('button', { name: 'Add to Bag' }).click();

    await page.waitForTimeout(2000);

    await page.getByTitle('Bag').click();

    await page.getByRole('link', { name: 'Checkout' }).click();

    // await page.waitForURL('/checkouts/*');

    await page.getByLabel('Country/Region').selectOption('AU');
    await page.locator('#email').fill('johnv@mindarc.com.au');
    await page.mouse.wheel(0, 300);
    await page.mouse.wheel(0, 300);
    await page.getByPlaceholder('Address').fill('4 Australia Street');
    await page.getByPlaceholder('First name (optional)').fill('John');
    await page.getByPlaceholder('Last name').fill('Certeza-Vella');
    await page.getByPlaceholder('City').fill('Camperdown');
    await page.getByLabel('State/territory').selectOption({ value: 'NSW' });
    await page.getByPlaceholder('Postcode').focus();
    await page.getByPlaceholder('Postcode').pressSequentially('2050');

    // This box
    // await page.getByLabel('State/territory').selectOption({ value: 'NSW' });
    await page.getByLabel('Save this information for').click();

    await page.waitForSelector('#shipping_methods')

    // await page.locator('.shipping_methods input').first().click();

    await page.frameLocator('.card-fields-iframe').nth(0)
        .getByLabel('Card number')
        .fill('1');

    await page.frameLocator('.card-fields-iframe').nth(1)
        .getByPlaceholder('Expiration date (MM / YY)')
        .fill('04/24');

    await page.frameLocator('.card-fields-iframe').nth(2)
        .getByPlaceholder('Security code')
        .fill('123');

    if (runCheckoutProcess) {
        await page.getByRole('button', { name: 'Pay now' }).click();
        await page.mouse.wheel(0, 300);
        await expect(page).toHaveTitle(/Thank you/);
    }
});
