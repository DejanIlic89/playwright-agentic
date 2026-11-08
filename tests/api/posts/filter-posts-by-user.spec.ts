import { test, expect } from '../../../src/fixtures/api.fixture.js';
import { postsSchema } from '../../../src/schemas/post.schema.js';

const userIds = [1, 2, 3];

for (const userId of userIds) {
  test(`GET /posts returns only posts for user ${userId}`, async ({
    postsClient,
  }) => {
    const response = await postsClient.getPostsByUser(userId);

    expect(response.status()).toBe(200);

    const body: unknown = await response.json();
    const posts = postsSchema.parse(body);

    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.userId).toBe(userId);
    }
  });
}
