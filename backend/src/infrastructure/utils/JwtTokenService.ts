/**
 * Infrastructure: Token Service
 * JWT implementation of TokenService
 */

import jwt from 'jsonwebtoken';
import { TokenPayload } from '@domain/entities/Auth';
import { TokenService } from '@domain/interfaces/TokenService';

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error(
    'JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables'
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export function createJwtTokenService(): TokenService {
  return {
    generateAccessToken(payload: TokenPayload): string {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      } as jwt.SignOptions);
    },

    generateRefreshToken(payload: TokenPayload): string {
      return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
      } as jwt.SignOptions);
    },

    verifyAccessToken(token: string): TokenPayload {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    },

    verifyRefreshToken(token: string): TokenPayload {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    },
  };
}
