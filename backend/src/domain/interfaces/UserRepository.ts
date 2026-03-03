/**
 * Domain interface: UserRepository
 * Defines the contract for user data access
 */

import { CreateUserData, UpdateUserData, User, UserPublicData, UserWithCounts } from '@domain/entities/User';

export interface UserWithPassword extends User {
  password: string;
}

export interface ListUsersPublicResult {
  users: UserPublicData[];
  total: number;
}

export interface ListUsersPublicParams {
  skip: number;
  take: number;
  search?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdWithCounts(id: string): Promise<UserWithCounts | null>;
  findByIdPublic(id: string): Promise<UserPublicData | null>;
  findManyPublic(params: ListUsersPublicParams): Promise<ListUsersPublicResult>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  existsByEmailOrUsername(email: string, username: string): Promise<boolean>;
}
