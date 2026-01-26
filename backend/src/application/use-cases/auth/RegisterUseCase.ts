/**
 * Application: Use Case
 * Register new user
 */

import { AuthResult } from '../../../domain/entities/Auth.js';
import { UserRepository } from '../../../domain/interfaces/UserRepository.js';
import { PasswordHasher } from '../../../domain/interfaces/PasswordHasher.js';
import { TokenService } from '../../../domain/interfaces/TokenService.js';
import { RefreshTokenRepository } from '../../../domain/interfaces/RefreshTokenRepository.js';
import { AppError } from '../../../infrastructure/config/errors.js';

export interface RegisterUseCaseInput {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export async function registerUseCase(
  input: RegisterUseCaseInput,
  dependencies: {
    userRepository: UserRepository;
    passwordHasher: PasswordHasher;
    tokenService: TokenService;
    refreshTokenRepository: RefreshTokenRepository;
  }
): Promise<AuthResult> {
  const { userRepository, passwordHasher, tokenService, refreshTokenRepository } =
    dependencies;

  // Check if user exists
  const exists = await userRepository.existsByEmailOrUsername(
    input.email,
    input.username
  );

  if (exists) {
    throw new AppError('User with this email or username already exists', 409);
  }

  // Hash password
  const hashedPassword = await passwordHasher.hash(input.password);

  // Create user
  const user = await userRepository.create({
    email: input.email,
    username: input.username,
    password: hashedPassword,
    name: input.name,
  });

  // Generate tokens
  const tokenPayload = { userId: user.id, email: user.email };
  const accessToken = tokenService.generateAccessToken(tokenPayload);
  const refreshToken = tokenService.generateRefreshToken(tokenPayload);

  // Save refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await refreshTokenRepository.create(refreshToken, user.id, expiresAt);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
    },
    accessToken,
    refreshToken,
  };
}
