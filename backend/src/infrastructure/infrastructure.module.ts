import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { createPrismaUserRepository } from '@infrastructure/database/PrismaUserRepository';
import { createPrismaRefreshTokenRepository } from '@infrastructure/database/PrismaRefreshTokenRepository';
import { createPrismaFollowRepository } from '@infrastructure/database/PrismaFollowRepository';
import { createPrismaPostRepository } from '@infrastructure/database/PrismaPostRepository';
import { createJwtTokenService } from '@infrastructure/utils/JwtTokenService';
import { createBcryptPasswordHasher } from '@infrastructure/utils/BcryptPasswordHasher';
import type { UserRepository } from '@domain/interfaces/UserRepository';
import type { RefreshTokenRepository } from '@domain/interfaces/RefreshTokenRepository';
import type { FollowRepository } from '@domain/interfaces/FollowRepository';
import type { PostRepository } from '@domain/interfaces/PostRepository';
import type { TokenService } from '@domain/interfaces/TokenService';
import type { PasswordHasher } from '@domain/interfaces/PasswordHasher';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const REFRESH_TOKEN_REPOSITORY = 'REFRESH_TOKEN_REPOSITORY';
export const FOLLOW_REPOSITORY = 'FOLLOW_REPOSITORY';
export const POST_REPOSITORY = 'POST_REPOSITORY';
export const TOKEN_SERVICE = 'TOKEN_SERVICE';
export const PASSWORD_HASHER = 'PASSWORD_HASHER';

@Global()
@Module({
  imports: [PrismaModule],
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
      provide: POST_REPOSITORY,
      useFactory: (prisma: PrismaService): PostRepository =>
        createPrismaPostRepository(prisma),
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
    POST_REPOSITORY,
    TOKEN_SERVICE,
    PASSWORD_HASHER,
  ],
})
export class InfrastructureModule {}
