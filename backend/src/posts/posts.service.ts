import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from '@infrastructure/infrastructure.module';
import type { PostRepository } from '@domain/interfaces/PostRepository';
import type { Post, PostWithAuthor, UpdatePostData } from '@domain/entities/Post';
import { createPostUseCase } from '@application/use-cases/posts/CreatePostUseCase';
import { getPostUseCase } from '@application/use-cases/posts/GetPostUseCase';
import { listPostsUseCase } from '@application/use-cases/posts/ListPostsUseCase';
import { updatePostUseCase } from '@application/use-cases/posts/UpdatePostUseCase';
import { deletePostUseCase } from '@application/use-cases/posts/DeletePostUseCase';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: PostRepository,
  ) {}

  async create(authorId: string, data: { content: string; attachments?: string[] }): Promise<Post> {
    return createPostUseCase(
      { authorId, content: data.content, attachments: data.attachments },
      { postRepository: this.postRepository },
    );
  }

  async getById(postId: string): Promise<PostWithAuthor> {
    return getPostUseCase({ postId }, { postRepository: this.postRepository });
  }

  async list(params: { page: number; limit: number; authorId?: string }): Promise<{
    posts: PostWithAuthor[];
    total: number;
    page: number;
    limit: number;
  }> {
    return listPostsUseCase(params, { postRepository: this.postRepository });
  }

  async update(postId: string, authorId: string, data: UpdatePostData): Promise<Post> {
    return updatePostUseCase(
      { postId, authorId, data },
      { postRepository: this.postRepository },
    );
  }

  async delete(postId: string, authorId: string): Promise<void> {
    return deletePostUseCase(
      { postId, authorId },
      { postRepository: this.postRepository },
    );
  }
}
