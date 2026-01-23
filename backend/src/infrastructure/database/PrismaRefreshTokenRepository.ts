/**
 * Infrastructure: Database Repository
 * Prisma implementation of RefreshTokenRepository
 */

import { PrismaClient } from '@prisma/client';
import { RefreshTokenRepository } from '../../domain/interfaces/RefreshTokenRepository.js';

export function createPrismaRefreshTokenRepository(
  prisma: PrismaClient
): RefreshTokenRepository {
  return {
    async create(token: string, userId: string, expiresAt: Date): Promise<void> {
      await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });
    },

    async findByToken(
      token: string
    ): Promise<{ userId: string; expiresAt: Date } | null> {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token },
        select: {
          userId: true,
          expiresAt: true,
        },
      });

      if (!refreshToken) return null;

      return {
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
      };
    },

    async deleteByToken(token: string): Promise<void> {
      await prisma.refreshToken.deleteMany({
        where: { token },
      });
    },
  };
}
