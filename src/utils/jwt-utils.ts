import { SignOptions, sign, verify } from 'jsonwebtoken';

import { environment } from '../config/environment';

export function generateAccessToken(
  payload: string | Buffer | object,
  options: SignOptions = {}
) {
  const { expiresIn = '1d' } = options;

  return sign(payload, environment.jwtAccessTokenSecret, { expiresIn });
}

export function generateRefreshToken(payload: string | Buffer | object) {
  return sign(payload, environment.jwtRefreshTokenSecret);
}

export function verifyAccessToken(accessToken: string) {
  return verify(accessToken, environment.jwtAccessTokenSecret);
}

export function verifyRefreshToken(refreshToken: string) {
  return verify(refreshToken, environment.jwtRefreshTokenSecret);
}
