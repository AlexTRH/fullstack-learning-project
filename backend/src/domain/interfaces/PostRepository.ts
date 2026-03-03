/**
 * Domain interface: PostRepository
 * Contract for post data access
 */

import type { Post, PostWithAuthor, CreatePostData, UpdatePostData } from '@domain/entities/Post';

export interface ListPostsParams {
  skip: number;
  take: number;
  authorId?: string;
}

export interface ListPostsResult {
  posts: PostWithAuthor[];
  total: number;
}

export interface PostRepository {
  create(data: CreatePostData): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findByIdWithAuthor(id: string): Promise<PostWithAuthor | null>;
  findMany(params: ListPostsParams): Promise<ListPostsResult>;
  update(id: string, data: UpdatePostData): Promise<Post>;
  /** Soft delete: sets isDeleted = true */
  delete(id: string): Promise<void>;
  countByAuthor(authorId: string): Promise<number>;
}
