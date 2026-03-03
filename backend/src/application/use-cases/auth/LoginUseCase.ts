/**
 * Application: Use Case
 * Login user
 */

import { AuthResult } from '@domain/entities/Auth';
import { UserRepository } from '@domain/interfaces/UserRepository';
import { PasswordHasher } from '@domain/interfaces/PasswordHasher';
import { TokenService } from '@domain/interfaces/TokenService';
import { RefreshTokenRepository } from '@domain/interfaces/RefreshTokenRepository';
import { AppError } from '@infrastructure/config/errors';

export interface LoginUseCaseInput {
  email: string;
  password: string;
}

export async function loginUseCase(
  input: LoginUseCaseInput,
  dependencies: {
    userRepository: UserRepository;
    passwordHasher: PasswordHasher;
    tokenService: TokenService;
    refreshTokenRepository: RefreshTokenRepository;
  }
): Promise<AuthResult> {
  const { userRepository, passwordHasher, tokenService, refreshTokenRepository } =
    dependencies;

  // Find user with password
  const user = await userRepository.findByEmailWithPassword(input.email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await passwordHasher.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

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
