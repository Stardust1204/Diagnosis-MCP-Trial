import { test, expect } from '@playwright/test';

test.describe('DemoBlaze cart', () => {
  test('add a product to the cart', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Cart' }).click();
    await expect(page.locator('tr.success')).toContainText('Samsung galaxy s6');
  });

  test('place an order', async ({ page }) => {
    await page.goto('/cart.html');
    await page.getByRole('button', { name: 'Place Order' }).click();
    await page.locator('#name').fill('Test User');
    await page.locator('#country').fill('Mauritius');
    await page.locator('#city').fill('Port Louis');
    await page.locator('#card').fill('4111111111111111');
    await page.locator('#month').fill('12');
    await page.locator('#year').fill('2030');
    await page.getByRole('button', { name: 'Purchase' }).click();
    await expect(page.locator('.sweet-alert')).toBeVisible();
  });
});
