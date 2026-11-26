import { test, expect } from '@playwright/test';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts/1';

// Valid post shape, so only the HTTP status makes the first response fail.
const failedPost = {
  id: 1,
  userId: 1,
  title: 'This title must not be displayed',
  body: 'The HTTP status makes this response unsuccessful.',
};

// Distinct title, so the heading can only come from the second response.
const retriedPost = {
  id: 1,
  userId: 1,
  title: 'Post loaded after retry',
  body: 'Controlled successful response for the second attempt.',
};

test('successfully loads a post after an HTTP error', async ({ page }) => {
  const interceptedMethods: string[] = [];

  // Registered before navigation so the real API is never reached.
  // The first request fails with HTTP 500; the second succeeds.
  await page.route(POST_URL, async (route) => {
    interceptedMethods.push(route.request().method());

    if (interceptedMethods.length === 1) {
      await route.fulfill({
        status: 500,
        json: failedPost,
      });
    } else {
      await route.fulfill({
        status: 200,
        json: retriedPost,
      });
    }
  });

  await page.goto('/');

  const loadPostButton = page.getByRole('button', { name: 'Load post' });
  const status = page.getByRole('status');
  const alert = page.getByRole('alert');

  await loadPostButton.click();

  await expect(alert).toBeVisible();
  await expect(alert).toHaveText('Unable to load post');
  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(0);
  await expect(loadPostButton).toBeEnabled();
  await expect(status).toHaveText('');

  await loadPostButton.click();

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: retriedPost.title,
      exact: true,
    }),
  ).toBeVisible();
  await expect(alert).toBeHidden();
  await expect(loadPostButton).toBeEnabled();
  await expect(status).toHaveText('');

  expect(interceptedMethods).toEqual(['GET', 'GET']);
});
