import { test, expect } from '../../../src/fixtures/api.fixture.js';

test('GET /posts returns 404 for a missing post', async ({
  postsClient,
}) => {
  const response = await postsClient.getPost(999999);

  expect(response.status()).toBe(404);
  expect(response.ok()).toBe(false);

  const body: unknown = await response.json();

  expect(body).toEqual({});
});