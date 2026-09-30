import { expect, test } from '@playwright/test';

test('loads the app and shows weather search UI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Previsão do tempo')).toBeVisible();
  await expect(page.getByRole('textbox', { name: /cidade/i })).toBeVisible();
});
