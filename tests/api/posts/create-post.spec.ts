import { test, expect } from '../../../src/fixtures/api.fixture.js';
import type { CreatePostPayload } from '../../../src/api/posts.client.js';
import { postSchema } from '../../../src/schemas/post.schema.js';

test('POST /posts returns the created post', async ({ postsClient }) => {
  const payload: CreatePostPayload = {
    title: 'Playwright API testing',
    body: 'Creating a post with Playwright.',
    userId: 1,
  };

  const response = await postsClient.createPost(payload);

  expect(response.status()).toBe(201);

  const body: unknown = await response.json();
  const createdPost = postSchema.parse(body);

  expect(createdPost).toMatchObject(payload);
});
