/**
 * Application: Use Case
 * Get current user profile
 */

import { UserWithCounts } from '../../../domain/entities/User.js';
import { UserRepository } from '../../../domain/interfaces/UserRepository.js';
import { AppError } from '../../../infrastructure/config/errors.js';

export interface GetMeUseCaseInput {
  userId: string;
}

export async function getMeUseCase(
  input: GetMeUseCaseInput,
  dependencies: {
    userRepository: UserRepository;
  }
): Promise<UserWithCounts> {
  const { userRepository } = dependencies;

  const user = await userRepository.findByIdWithCounts(input.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}
