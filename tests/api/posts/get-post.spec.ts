import { test, expect } from '../../../src/fixtures/api.fixture.js';
import { postSchema } from '../../../src/schemas/post.schema.js';

test('GET /posts/1 returns the expected post', async ({ postsClient }) => {
  const response = await postsClient.getPost(1);

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const body: unknown = await response.json();
  const post = postSchema.parse(body);

  expect(post.id).toBe(1);
  expect(post.userId).toBe(1);
  expect(post.title.length).toBeGreaterThan(0);
  expect(post.body.length).toBeGreaterThan(0);
});
