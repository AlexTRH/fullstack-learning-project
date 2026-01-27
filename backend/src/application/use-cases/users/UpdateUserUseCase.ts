/**
 * Application: Use Case
 * Update authenticated user profile
 */

import { UpdateUserData, User } from '../../../domain/entities/User.js';
import { UserRepository } from '../../../domain/interfaces/UserRepository.js';
import { AppError } from '../../../infrastructure/config/errors.js';

export interface UpdateUserUseCaseInput {
  userId: string;
  data: UpdateUserData;
}

export async function updateUserUseCase(
  input: UpdateUserUseCaseInput,
  dependencies: {
    userRepository: UserRepository;
  }
): Promise<User> {
  const { userRepository } = dependencies;

  // Check if user exists
  const existingUser = await userRepository.findById(input.userId);
  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Update user
  const updatedUser = await userRepository.update(input.userId, input.data);

  return updatedUser;
}
