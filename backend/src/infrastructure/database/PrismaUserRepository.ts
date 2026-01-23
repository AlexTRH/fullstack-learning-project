/**
 * Infrastructure: Database Repository
 * Prisma implementation of UserRepository
 */

import { PrismaClient } from '@prisma/client';
import { CreateUserData, User, UserWithCounts } from '../../domain/entities/User.js';
import { UserRepository, UserWithPassword } from '../../domain/interfaces/UserRepository.js';

export function createPrismaUserRepository(prisma: PrismaClient): UserRepository {
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

function mapToDomainUser(prismaUser: any): User {
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
