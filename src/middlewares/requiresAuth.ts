import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt-utils';

type TokenType = 'refreshToken' | 'accessToken';

export function requiresAuth(tokenType: TokenType = 'accessToken') {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers?.authorization;

    if (authHeader) {
      // Bearer token
      try {
        var [bearer, token] = authHeader.split(' '); // using var, so that token is in a function scope

        if (bearer.toLowerCase() !== 'bearer' || !token) {
          throw Error;
        }
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Bearer token malformed',
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Authorization header not found',
      });
    }

    // verifying
    try {
      let jwt;
      switch (tokenType) {
        case 'accessToken':
          jwt = verifyAccessToken(token);
          break;
        case 'refreshToken':
          jwt = verifyRefreshToken(token);
          break;
      }

      req.body.jwt = jwt;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  };
}
