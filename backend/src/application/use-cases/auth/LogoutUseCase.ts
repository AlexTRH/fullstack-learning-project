/**
 * Application: Use Case
 * Logout user
 */

import { RefreshTokenRepository } from '../../../domain/interfaces/RefreshTokenRepository.js';

export interface LogoutUseCaseInput {
  refreshToken: string;
}

export async function logoutUseCase(
  input: LogoutUseCaseInput,
  dependencies: {
    refreshTokenRepository: RefreshTokenRepository;
  }
): Promise<void> {
  const { refreshTokenRepository } = dependencies;

  if (input.refreshToken) {
    await refreshTokenRepository.deleteByToken(input.refreshToken);
  }
}
