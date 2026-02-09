/**
 * Infrastructure: Database Repository
 * Prisma implementation of UserRepository
 */

import type { User as PrismaUser } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserData, UpdateUserData, User, UserPublicData, UserWithCounts } from '../../domain/entities/User';
import {
  ListUsersPublicParams,
  ListUsersPublicResult,
  UserRepository,
  UserWithPassword,
} from '../../domain/interfaces/UserRepository';

export function createPrismaUserRepository(prisma: PrismaService): UserRepository {
  return {
    async findByEmail(email: string): Promise<User | null> {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) return null;

      return user as User;
    },

    async findByEmailWithPassword(email: string): Promise<UserWithPassword | null> {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) return null;

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        password: user.password,
      };
    },

    async findByUsername(username: string): Promise<User | null> {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) return null;

      return mapToDomainUser(user);
    },

    async findById(id: string): Promise<User | null> {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) return null;

      return mapToDomainUser(user);
    },

    async findByIdWithCounts(id: string): Promise<UserWithCounts | null> {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          name: true,
          bio: true,
          avatar: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              posts: true,
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) return null;

      return user as UserWithCounts;
    },

    async findByIdPublic(id: string): Promise<UserPublicData | null> {
      const user = await prisma.user.findUnique({
        where: { id },
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
      });

      if (!user) return null;

      return user as UserPublicData;
    },

    async findManyPublic(params: ListUsersPublicParams): Promise<ListUsersPublicResult> {
      const { skip, take, search } = params;
      const where = search?.trim()
        ? {
            OR: [
              { username: { contains: search.trim(), mode: 'insensitive' as const } },
              { name: { contains: search.trim(), mode: 'insensitive' as const } },
            ],
          }
        : undefined;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
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
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users: users as UserPublicData[],
        total,
      };
    },

    async create(data: CreateUserData): Promise<User> {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          name: data.name || data.username,
          password: data.password, // Password will be hashed before calling this
        },
      });

      return mapToDomainUser(user);
    },

    async update(id: string, data: UpdateUserData): Promise<User> {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.bio !== undefined && { bio: data.bio }),
          ...(data.avatar !== undefined && { avatar: data.avatar }),
        },
      });

      return mapToDomainUser(user);
    },

    async existsByEmailOrUsername(email: string, username: string): Promise<boolean> {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      });

      return !!user;
    },
  };
}

function mapToDomainUser(prismaUser: PrismaUser): User {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    username: prismaUser.username,
    name: prismaUser.name,
    avatar: prismaUser.avatar,
    bio: prismaUser.bio,
    role: prismaUser.role,
    isVerified: prismaUser.isVerified,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
  };
}
