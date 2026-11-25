import { test, expect } from '@playwright/test';

test.describe('DemoBlaze authentication', () => {
  test('sign up with a new user', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.locator('#sign-username').fill(`user_${Date.now()}@test.com`);
    await page.locator('#sign-password').fill('Password123!');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page.locator('.alert')).toHaveText('Sign up successful.');
  });

  test('log in with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill('testuser');
    await page.locator('#loginpassword').fill('Password123!');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });
});
