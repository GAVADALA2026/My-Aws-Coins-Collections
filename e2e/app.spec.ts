import { test, expect } from '@playwright/test';

async function openDemo(page: import('@playwright/test').Page) {
  await page.goto('/');
}

test.describe('Coin collection app', () => {
  test('opens the public demo on the home page', async ({ page }) => {
    await openDemo(page);
    await expect(page.getByText('Add a new coin')).toBeVisible();
  });

  test('loads the coin collection in the public demo', async ({ page }) => {
    await openDemo(page);
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).toBeVisible({ timeout: 5000 });
  });

  test('sells a coin after confirmation', async ({ page }) => {
    await openDemo(page);
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).toBeVisible({ timeout: 5000 });
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Sell 1 Euro Cent' }).click();
    await expect(page.locator('h3', { hasText: '1 Euro Cent' })).not.toBeVisible();
  });
});
