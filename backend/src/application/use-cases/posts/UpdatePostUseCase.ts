/**
 * Application: Use Case
 * Update a post (author only)
 */

import { Post, UpdatePostData } from '@domain/entities/Post';
import { PostRepository } from '@domain/interfaces/PostRepository';
import { AppError } from '@infrastructure/config/errors';

export interface UpdatePostUseCaseInput {
  postId: string;
  authorId: string;
  data: UpdatePostData;
}

export async function updatePostUseCase(
  input: UpdatePostUseCaseInput,
  dependencies: { postRepository: PostRepository },
): Promise<Post> {
  const { postRepository } = dependencies;

  const post = await postRepository.findById(input.postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== input.authorId) {
    throw new AppError('Forbidden', 403);
  }

  if (input.data.content !== undefined && !input.data.content?.trim()) {
    throw new AppError('Content cannot be empty', 400);
  }

  return postRepository.update(input.postId, input.data);
}
