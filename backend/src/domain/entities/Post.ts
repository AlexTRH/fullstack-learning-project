/**
 * Domain entity: Post
 * Represents a post in the social feed
 */

import type { UserPublicData } from '@domain/entities/User';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  attachments: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Post with author info for feed and detail views */
export interface PostWithAuthor extends Post {
  author: UserPublicData;
}

export interface CreatePostData {
  content: string;
  authorId: string;
  attachments?: string[];
}

export interface UpdatePostData {
  content?: string;
  attachments?: string[];
}
