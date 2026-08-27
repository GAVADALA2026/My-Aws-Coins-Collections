import { test, expect } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByPlaceholder('Enter your username').fill('gabriele');
  await page.getByPlaceholder('Enter your password').fill('password');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/home/);
}

test.describe('Coin collection app', () => {
  test('logs in and lands on the home page', async ({ page }) => {
    await login(page);
    await expect(page.getByText('Add a new coin')).toBeVisible();
  });

  test('loads the coin collection after login', async ({ page }) => {
    await login(page);
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).toBeVisible({ timeout: 5000 });
  });

  test('sells a coin after confirmation', async ({ page }) => {
    await login(page);
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).toBeVisible({ timeout: 5000 });
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Sell 1 Euro Cent' }).click();
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).not.toBeVisible();
  });
});
