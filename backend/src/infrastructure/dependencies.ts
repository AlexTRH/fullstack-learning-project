/**
 * Infrastructure: Dependency Injection
 * Creates and provides all dependencies for the application
 */

import prisma from './database/prisma.js';
import { createPrismaUserRepository } from './database/PrismaUserRepository.js';
import { createPrismaRefreshTokenRepository } from './database/PrismaRefreshTokenRepository.js';
import { createJwtTokenService } from './utils/JwtTokenService.js';
import { createBcryptPasswordHasher } from './utils/BcryptPasswordHasher.js';
import { UserRepository } from '../domain/interfaces/UserRepository.js';
import { PasswordHasher } from '../domain/interfaces/PasswordHasher.js';
import { TokenService } from '../domain/interfaces/TokenService.js';
import { RefreshTokenRepository } from '../domain/interfaces/RefreshTokenRepository.js';

// Create infrastructure implementations
const userRepository: UserRepository = createPrismaUserRepository(prisma);
const refreshTokenRepository: RefreshTokenRepository =
  createPrismaRefreshTokenRepository(prisma);
const tokenService: TokenService = createJwtTokenService();
const passwordHasher: PasswordHasher = createBcryptPasswordHasher();

// Export dependencies object for use cases
export const dependencies = {
  userRepository,
  refreshTokenRepository,
  tokenService,
  passwordHasher,
};
