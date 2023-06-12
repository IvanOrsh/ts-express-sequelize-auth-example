import { hash, compare } from 'bcrypt';

import { environment } from '../config/environment';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, environment.saltRounds);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}
