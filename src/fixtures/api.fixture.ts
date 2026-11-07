import { test as base, expect } from '@playwright/test';
import { PostsClient } from '../api/posts.client.js';

type ApiFixtures = {
  postsClient: PostsClient;
};

export const test = base.extend<ApiFixtures>({
  postsClient: async ({ request }, use) => {
    const postsClient = new PostsClient(request);

    await use(postsClient);
  },
});

export { expect };