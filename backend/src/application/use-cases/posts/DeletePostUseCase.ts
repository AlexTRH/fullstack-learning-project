/**
 * Application: Use Case
 * Soft-delete a post (author only)
 */

import { PostRepository } from '@domain/interfaces/PostRepository';
import { AppError } from '@infrastructure/config/errors';

export interface DeletePostUseCaseInput {
  postId: string;
  authorId: string;
}

export async function deletePostUseCase(
  input: DeletePostUseCaseInput,
  dependencies: { postRepository: PostRepository },
): Promise<void> {
  const { postRepository } = dependencies;

  const post = await postRepository.findById(input.postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== input.authorId) {
    throw new AppError('Forbidden', 403);
  }

  await postRepository.delete(input.postId);
}
