/**
 * Application: Use Case
 * Create a new post
 */

import { Post } from '@domain/entities/Post';
import { PostRepository } from '@domain/interfaces/PostRepository';
import { AppError } from '@infrastructure/config/errors';

export interface CreatePostUseCaseInput {
  authorId: string;
  content: string;
  attachments?: string[];
}

export async function createPostUseCase(
  input: CreatePostUseCaseInput,
  dependencies: { postRepository: PostRepository },
): Promise<Post> {
  const { postRepository } = dependencies;

  if (!input.content?.trim()) {
    throw new AppError('Content is required', 400);
  }

  return postRepository.create({
    authorId: input.authorId,
    content: input.content.trim(),
    attachments: input.attachments?.length ? input.attachments : undefined,
  });
}
