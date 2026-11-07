import type { APIRequestContext, APIResponse } from '@playwright/test';

export type CreatePostPayload = {
  title: string;
  body: string;
  userId: number;
};

export class PostsClient {
  constructor(private readonly request: APIRequestContext) {}

  getPost(postId: number): Promise<APIResponse> {
    return this.request.get(`/posts/${postId}`);
  }

  getPostsByUser(userId: number): Promise<APIResponse> {
    return this.request.get('/posts', {
      params: { userId },
    });
  }

  createPost(payload: CreatePostPayload): Promise<APIResponse> {
    return this.request.post('/posts', {
      data: payload,
    });
  }

  updatePostTitle(postId: number, title: string): Promise<APIResponse> {
    return this.request.patch(`/posts/${postId}`, {
      data: { title },
    });
  }
}
