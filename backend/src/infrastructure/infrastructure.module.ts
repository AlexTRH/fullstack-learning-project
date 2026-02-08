import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaUserRepository } from './database/PrismaUserRepository';
import { createPrismaRefreshTokenRepository } from './database/PrismaRefreshTokenRepository';
import { createPrismaFollowRepository } from './database/PrismaFollowRepository';
import { createJwtTokenService } from './utils/JwtTokenService';
import { createBcryptPasswordHasher } from './utils/BcryptPasswordHasher';
import type { UserRepository } from '../domain/interfaces/UserRepository';
import type { RefreshTokenRepository } from '../domain/interfaces/RefreshTokenRepository';
import type { FollowRepository } from '../domain/interfaces/FollowRepository';
import type { TokenService } from '../domain/interfaces/TokenService';
import type { PasswordHasher } from '../domain/interfaces/PasswordHasher';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const REFRESH_TOKEN_REPOSITORY = 'REFRESH_TOKEN_REPOSITORY';
export const FOLLOW_REPOSITORY = 'FOLLOW_REPOSITORY';
export const TOKEN_SERVICE = 'TOKEN_SERVICE';
export const PASSWORD_HASHER = 'PASSWORD_HASHER';

@Global()
@Module({
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (prisma: PrismaService): UserRepository =>
        createPrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useFactory: (prisma: PrismaService): RefreshTokenRepository =>
        createPrismaRefreshTokenRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: FOLLOW_REPOSITORY,
      useFactory: (prisma: PrismaService): FollowRepository =>
        createPrismaFollowRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TOKEN_SERVICE,
      useFactory: (): TokenService => createJwtTokenService(),
    },
    {
      provide: PASSWORD_HASHER,
      useFactory: (): PasswordHasher => createBcryptPasswordHasher(),
    },
  ],
  exports: [
    USER_REPOSITORY,
    REFRESH_TOKEN_REPOSITORY,
    FOLLOW_REPOSITORY,
    TOKEN_SERVICE,
    PASSWORD_HASHER,
  ],
})
export class InfrastructureModule {}
