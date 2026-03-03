/**
 * Application: Use Case
 * Get a single post by ID with author info
 */

import { PostWithAuthor } from '@domain/entities/Post';
import { PostRepository } from '@domain/interfaces/PostRepository';
import { AppError } from '@infrastructure/config/errors';

export interface GetPostUseCaseInput {
  postId: string;
}

export async function getPostUseCase(
  input: GetPostUseCaseInput,
  dependencies: { postRepository: PostRepository },
): Promise<PostWithAuthor> {
  const { postRepository } = dependencies;

  const post = await postRepository.findByIdWithAuthor(input.postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
}
