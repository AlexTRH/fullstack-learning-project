/**
 * Application: Use Case
 * Refresh access token
 */

import { TokenService } from '../../../domain/interfaces/TokenService.js';
import { RefreshTokenRepository } from '../../../domain/interfaces/RefreshTokenRepository.js';
import { AppError } from '../../../infrastructure/config/errors.js';

export interface RefreshTokenUseCaseInput {
  refreshToken: string;
}

export interface RefreshTokenUseCaseOutput {
  accessToken: string;
}

export async function refreshTokenUseCase(
  input: RefreshTokenUseCaseInput,
  dependencies: {
    tokenService: TokenService;
    refreshTokenRepository: RefreshTokenRepository;
  }
): Promise<RefreshTokenUseCaseOutput> {
  const { tokenService, refreshTokenRepository } = dependencies;

  // Verify refresh token
  let payload;
  try {
    payload = tokenService.verifyRefreshToken(input.refreshToken);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Check if token exists in DB
  const storedToken = await refreshTokenRepository.findByToken(input.refreshToken);

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Generate new access token
  const accessToken = tokenService.generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  return { accessToken };
}
