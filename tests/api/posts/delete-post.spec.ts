import { test, expect } from '../../../src/fixtures/api.fixture.js';

test('DELETE /posts/1 returns a successful response', async ({
  postsClient,
}) => {
  const response = await postsClient.deletePost(1);

  expect(response.status()).toBe(200);

  const body: unknown = await response.json();

  expect(body).toEqual({});
});
