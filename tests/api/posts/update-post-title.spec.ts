import { test, expect } from '../../../src/fixtures/api.fixture.js';
import { postSchema } from '../../../src/schemas/post.schema.js';

test('PATCH /posts/1 updates the post title', async ({ postsClient }) => {
  const postId = 1;
  const title = 'Updated post title';

  const originalResponse = await postsClient.getPost(postId);

  expect(originalResponse.status()).toBe(200);

  const originalPost = postSchema.parse(await originalResponse.json());

  const response = await postsClient.updatePostTitle(postId, title);

  expect(response.status()).toBe(200);

  const body: unknown = await response.json();
  const updatedPost = postSchema.parse(body);

  expect(updatedPost.id).toBe(postId);
  expect(updatedPost.title).toBe(title);
  expect(updatedPost.body).toBe(originalPost.body);
  expect(updatedPost.userId).toBe(originalPost.userId);
});
