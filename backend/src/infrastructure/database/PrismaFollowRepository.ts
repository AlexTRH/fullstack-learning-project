/**
 * Infrastructure: Database Repository
 * Prisma implementation of FollowRepository
 */

import { PrismaClient } from '@prisma/client';
import { CreateFollowData, Follow } from '../../domain/entities/Follow.js';
import { UserPublicData } from '../../domain/entities/User.js';
import { FollowRepository } from '../../domain/interfaces/FollowRepository.js';

export function createPrismaFollowRepository(prisma: PrismaClient): FollowRepository {
  return {
    async create(data: CreateFollowData): Promise<Follow> {
      const follow = await prisma.follow.create({
        data: {
          followerId: data.followerId,
          followingId: data.followingId,
        },
      });

      return {
        id: follow.id,
        followerId: follow.followerId,
        followingId: follow.followingId,
        createdAt: follow.createdAt,
      };
    },

    async delete(followerId: string, followingId: string): Promise<void> {
      await prisma.follow.deleteMany({
        where: {
          followerId,
          followingId,
        },
      });
    },

    async exists(followerId: string, followingId: string): Promise<boolean> {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });

      return !!follow;
    },

    async findFollowers(userId: string): Promise<UserPublicData[]> {
      const follows = await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          follower: {
            select: {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return follows.map((follow) => follow.follower as UserPublicData);
    },

    async findFollowing(userId: string): Promise<UserPublicData[]> {
      const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: {
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return follows.map((follow) => follow.following as UserPublicData);
    },

    async countFollowers(userId: string): Promise<number> {
      return prisma.follow.count({
        where: { followingId: userId },
      });
    },

    async countFollowing(userId: string): Promise<number> {
      return prisma.follow.count({
        where: { followerId: userId },
      });
    },
  };
}
