/**
 * Infrastructure: Password Hasher
 * bcryptjs implementation of PasswordHasher
 */

import bcrypt from 'bcryptjs';
import { PasswordHasher } from '../../domain/interfaces/PasswordHasher.js';

const SALT_ROUNDS = 10;

export function createBcryptPasswordHasher(): PasswordHasher {
  return {
    async hash(password: string): Promise<string> {
      return bcrypt.hash(password, SALT_ROUNDS);
    },

    async compare(password: string, hashedPassword: string): Promise<boolean> {
      return bcrypt.compare(password, hashedPassword);
    },
  };
}
