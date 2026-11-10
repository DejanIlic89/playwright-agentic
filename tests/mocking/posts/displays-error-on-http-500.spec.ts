import { test, expect } from '@playwright/test';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts/1';

// Valid post shape, so only the HTTP status makes the response unsuccessful.
const postBody = {
  id: 1,
  userId: 1,
  title: 'This title must not be displayed',
  body: 'The HTTP status makes this response unsuccessful.',
};

test('displays an error when the API returns HTTP 500', async ({ page }) => {
  const interceptedMethods: string[] = [];

  // Registered before navigation so the real API is never reached.
  await page.route(POST_URL, async (route) => {
    interceptedMethods.push(route.request().method());

    await route.fulfill({
      status: 500,
      json: postBody,
    });
  });

  await page.goto('/');

  const loadPostButton = page.getByRole('button', { name: 'Load post' });
  await loadPostButton.click();

  const alert = page.getByRole('alert');
  await expect(alert).toBeVisible();
  await expect(alert).toHaveText('Unable to load post');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(0);
  await expect(loadPostButton).toBeEnabled();
  await expect(page.getByRole('status')).toHaveText('');

  expect(interceptedMethods).toEqual(['GET']);
});
