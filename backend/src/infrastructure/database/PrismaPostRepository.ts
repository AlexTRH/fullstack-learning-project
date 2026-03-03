/**
 * Infrastructure: Database Repository
 * Prisma implementation of PostRepository
 */

import { PrismaService } from '@/prisma/prisma.service';
import { Post, PostWithAuthor, CreatePostData, UpdatePostData } from '@domain/entities/Post';
import type { PostRepository, ListPostsParams, ListPostsResult } from '@domain/interfaces/PostRepository';
import type { UserPublicData } from '@domain/entities/User';

const authorSelect = {
  id: true,
  username: true,
  name: true,
  avatar: true,
  bio: true,
  isVerified: true,
  createdAt: true,
  _count: {
    select: {
      posts: true,
      followers: true,
      following: true,
    },
  },
} as const;

export function createPrismaPostRepository(prisma: PrismaService): PostRepository {
  return {
    async create(data: CreatePostData): Promise<Post> {
      const post = await prisma.post.create({
        data: {
          content: data.content,
          authorId: data.authorId,
          attachments: data.attachments ?? [],
        },
      });
      return mapToPost(post);
    },

    async findById(id: string): Promise<Post | null> {
      const post = await prisma.post.findFirst({
        where: { id, isDeleted: false },
      });
      return post ? mapToPost(post) : null;
    },

    async findByIdWithAuthor(id: string): Promise<PostWithAuthor | null> {
      const post = await prisma.post.findFirst({
        where: { id, isDeleted: false },
        include: {
          author: {
            select: authorSelect,
          },
        },
      });
      return post ? mapToPostWithAuthor(post) : null;
    },

    async findMany(params: ListPostsParams): Promise<ListPostsResult> {
      const { skip, take, authorId } = params;
      const where = {
        isDeleted: false,
        ...(authorId && { authorId }),
      };

      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: authorSelect,
            },
          },
        }),
        prisma.post.count({ where }),
      ]);

      return {
        posts: posts.map((p) => mapToPostWithAuthor(p)),
        total,
      };
    },

    async update(id: string, data: UpdatePostData): Promise<Post> {
      const post = await prisma.post.update({
        where: { id },
        data: {
          ...(data.content !== undefined && { content: data.content }),
          ...(data.attachments !== undefined && { attachments: data.attachments }),
        },
      });
      return mapToPost(post);
    },

    async delete(id: string): Promise<void> {
      await prisma.post.update({
        where: { id },
        data: { isDeleted: true },
      });
    },

    async countByAuthor(authorId: string): Promise<number> {
      return prisma.post.count({
        where: { authorId, isDeleted: false },
      });
    },
  };
}

function mapToPost(row: { id: string; content: string; authorId: string; attachments: string[]; isDeleted: boolean; createdAt: Date; updatedAt: Date }): Post {
  return {
    id: row.id,
    content: row.content,
    authorId: row.authorId,
    attachments: row.attachments,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Prisma User.followers = who I follow, User.following = who follows me. Domain expects the opposite. */
function mapAuthorCounts(
  author: {
    id: string;
    username: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    isVerified: boolean;
    createdAt: Date;
    _count: { posts: number; followers: number; following: number };
  },
): UserPublicData {
  return {
    ...author,
    _count: {
      posts: author._count.posts,
      followers: author._count.following,
      following: author._count.followers,
    },
  };
}

function mapToPostWithAuthor(
  row: {
    id: string;
    content: string;
    authorId: string;
    attachments: string[];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: {
      id: string;
      username: string;
      name: string | null;
      avatar: string | null;
      bio: string | null;
      isVerified: boolean;
      createdAt: Date;
      _count: { posts: number; followers: number; following: number };
    };
  },
): PostWithAuthor {
  return {
    ...mapToPost(row),
    author: mapAuthorCounts(row.author),
  };
}
