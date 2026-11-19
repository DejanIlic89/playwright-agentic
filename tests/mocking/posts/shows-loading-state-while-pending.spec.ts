import { test, expect } from '@playwright/test';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts/1';

const delayedPost = {
  id: 1,
  userId: 1,
  title: 'Post loaded after waiting',
  body: 'Controlled pending response.',
};

test('shows loading state while the API response is pending', async ({
  page,
}) => {
  const interceptedMethods: string[] = [];

  // Resolved by the route handler once it has received the request.
  let signalIntercepted!: () => void;
  const requestIntercepted = new Promise<void>((resolve) => {
    signalIntercepted = resolve;
  });

  // Resolved by the test to let the route handler fulfill the request.
  let releaseResponse!: () => void;
  const responseReleased = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });

  // Registered before navigation so the real API is never reached.
  await page.route(POST_URL, async (route) => {
    interceptedMethods.push(route.request().method());
    signalIntercepted();

    await responseReleased;

    await route.fulfill({
      status: 200,
      json: delayedPost,
    });
  });

  await page.goto('/');

  const loadPostButton = page.getByRole('button', { name: 'Load post' });
  const status = page.getByRole('status');
  const alert = page.getByRole('alert');

  await loadPostButton.click();
  await requestIntercepted;

  try {
    await expect(status).toHaveText('Loading...');
    await expect(loadPostButton).toBeDisabled();
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(0);
    await expect(alert).toBeHidden();
  } finally {
    // Always release, so the route handler is not left waiting on failure.
    releaseResponse();
  }

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: delayedPost.title,
      exact: true,
    }),
  ).toBeVisible();
  await expect(status).toHaveText('');
  await expect(loadPostButton).toBeEnabled();
  await expect(alert).toBeHidden();

  expect(interceptedMethods).toEqual(['GET']);
});
