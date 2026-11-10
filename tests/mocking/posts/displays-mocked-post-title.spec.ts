import { test, expect } from '@playwright/test';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts/1';

const mockedPost = {
  id: 1,
  userId: 1,
  title: 'Mocked post title',
  body: 'Controlled response for the UI test.',
};

test('displays the post title from a mocked API response', async ({ page }) => {
  const interceptedMethods: string[] = [];

  // Registered before navigation so the real API is never reached.
  await page.route(POST_URL, async (route) => {
    interceptedMethods.push(route.request().method());

    await route.fulfill({
      status: 200,
      json: mockedPost,
    });
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { level: 2 })).toHaveCount(0);
  expect(interceptedMethods).toEqual([]);

  const loadPostButton = page.getByRole('button', { name: 'Load post' });
  await loadPostButton.click();

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: mockedPost.title,
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('alert')).toBeHidden();
  await expect(loadPostButton).toBeEnabled();

  expect(interceptedMethods).toEqual(['GET']);
});
