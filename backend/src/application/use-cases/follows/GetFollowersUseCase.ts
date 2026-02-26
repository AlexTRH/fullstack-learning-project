/**
 * Application: Use Case
 * Get list of followers for a user
 */

import { UserPublicData } from '@domain/entities/User';
import { FollowRepository } from '@domain/interfaces/FollowRepository';
import { UserRepository } from '@domain/interfaces/UserRepository';
import { AppError } from '@infrastructure/config/errors';

export interface GetFollowersUseCaseInput {
  userId: string;
}

export async function getFollowersUseCase(
  input: GetFollowersUseCaseInput,
  dependencies: {
    followRepository: FollowRepository;
    userRepository: UserRepository;
  }
): Promise<UserPublicData[]> {
  const { followRepository, userRepository } = dependencies;

  // Check if user exists
  const user = await userRepository.findById(input.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get followers
  const followers = await followRepository.findFollowers(input.userId);

  return followers;
}
