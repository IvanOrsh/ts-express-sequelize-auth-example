import { JsonWebTokenError } from 'jsonwebtoken';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt-utils';

describe('Testing JWT utilities', () => {
  test('generateAccessToken should return an access token', () => {
    const payload = { email: 'test@test.com' };

    expect(generateAccessToken(payload)).toEqual(expect.any(String));
  });

  test('generateRefreshToken should return a refresh token', () => {
    const payload = { email: 'test@test.com' };

    expect(generateRefreshToken(payload)).toEqual(expect.any(String));
  });

  describe('verifyAccessToken', () => {
    test('should verify that the access token is valid', () => {
      const payload = { email: 'test@test.com' };
      const jwt = generateAccessToken(payload);

      expect(verifyAccessToken(jwt)).toEqual(expect.objectContaining(payload));
    });

    test('should throw error if the refresh token is invalid', () => {
      expect(() => verifyAccessToken('invalid_token')).toThrow(
        JsonWebTokenError
      );
    });
  });

  describe('verifyRefreshToken', () => {
    test('verifyRefreshToken should verify that the refresh token is valid', () => {
      const payload = { email: 'test@test.com' };
      const jwt = generateRefreshToken(payload);

      expect(verifyRefreshToken(jwt)).toEqual(expect.objectContaining(payload));
    });

    test('should throw error if the refresh token is invalid', () => {
      expect(() => verifyRefreshToken('invalid_token')).toThrow(
        JsonWebTokenError
      );
    });
  });
});
