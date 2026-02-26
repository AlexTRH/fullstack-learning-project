/**
 * Application: Use Case
 * List posts with pagination, optionally by author
 */

import { PostWithAuthor } from '@domain/entities/Post';
import { PostRepository } from '@domain/interfaces/PostRepository';

export interface ListPostsUseCaseInput {
  page: number;
  limit: number;
  authorId?: string;
}

export interface ListPostsUseCaseResult {
  posts: PostWithAuthor[];
  total: number;
  page: number;
  limit: number;
}

export async function listPostsUseCase(
  input: ListPostsUseCaseInput,
  dependencies: { postRepository: PostRepository },
): Promise<ListPostsUseCaseResult> {
  const { postRepository } = dependencies;
  const { page, limit, authorId } = input;

  const skip = (page - 1) * limit;

  const { posts, total } = await postRepository.findMany({
    skip,
    take: limit,
    authorId,
  });

  return {
    posts,
    total,
    page,
    limit,
  };
}
