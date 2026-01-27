/**
 * Infrastructure: Dependency Injection
 * Creates and provides all dependencies for the application
 */

import { FollowRepository } from '../domain/interfaces/FollowRepository.js';
import { PasswordHasher } from '../domain/interfaces/PasswordHasher.js';
import { RefreshTokenRepository } from '../domain/interfaces/RefreshTokenRepository.js';
import { TokenService } from '../domain/interfaces/TokenService.js';
import { UserRepository } from '../domain/interfaces/UserRepository.js';
import prisma from './database/prisma.js';
import { createPrismaFollowRepository } from './database/PrismaFollowRepository.js';
import { createPrismaRefreshTokenRepository } from './database/PrismaRefreshTokenRepository.js';
import { createPrismaUserRepository } from './database/PrismaUserRepository.js';
import { createBcryptPasswordHasher } from './utils/BcryptPasswordHasher.js';
import { createJwtTokenService } from './utils/JwtTokenService.js';

// Create infrastructure implementations
const userRepository: UserRepository = createPrismaUserRepository(prisma);
const refreshTokenRepository: RefreshTokenRepository =
  createPrismaRefreshTokenRepository(prisma);
const followRepository: FollowRepository = createPrismaFollowRepository(prisma);
const tokenService: TokenService = createJwtTokenService();
const passwordHasher: PasswordHasher = createBcryptPasswordHasher();

// Export dependencies object for use cases
export const dependencies = {
  userRepository,
  refreshTokenRepository,
  followRepository,
  tokenService,
  passwordHasher,
};
