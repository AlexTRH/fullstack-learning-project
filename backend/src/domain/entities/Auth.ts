/**
 * Domain entity: Auth
 * Represents authentication-related domain concepts
 */

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
