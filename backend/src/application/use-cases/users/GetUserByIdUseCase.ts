/**
 * Application: Use Case
 * Get public user profile by ID
 */

import { UserPublicData } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/interfaces/UserRepository';
import { AppError } from '../../../infrastructure/config/errors';

export interface GetUserByIdUseCaseInput {
  userId: string;
}

export async function getUserByIdUseCase(
  input: GetUserByIdUseCaseInput,
  dependencies: {
    userRepository: UserRepository;
  }
): Promise<UserPublicData> {
  const { userRepository } = dependencies;

  const user = await userRepository.findByIdPublic(input.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}
