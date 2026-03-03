/**
 * Application: Use Case
 * List users (find people) with pagination and optional search
 */

import { UserPublicData } from '@domain/entities/User';
import { UserRepository } from '@domain/interfaces/UserRepository';

export interface ListUsersUseCaseInput {
  page: number;
  limit: number;
  search?: string;
}

export interface ListUsersUseCaseResult {
  users: UserPublicData[];
  total: number;
  page: number;
  limit: number;
}

export async function listUsersUseCase(
  input: ListUsersUseCaseInput,
  dependencies: { userRepository: UserRepository },
): Promise<ListUsersUseCaseResult> {
  const { userRepository } = dependencies;
  const { page, limit, search } = input;

  const skip = (page - 1) * limit;

  const { users, total } = await userRepository.findManyPublic({
    skip,
    take: limit,
    search: search?.trim() || undefined,
  });

  return {
    users,
    total,
    page,
    limit,
  };
}
