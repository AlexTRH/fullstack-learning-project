/**
 * Domain entity: User
 * Represents the core user business entity
 */

export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithCounts extends User {
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface UserPublicData {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: Date;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  avatar?: string;
}
