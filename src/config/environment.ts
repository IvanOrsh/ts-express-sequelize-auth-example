// import { randomBytes } from 'node:crypto';
// randomBytes(64).toString('hex');

export const environment = {
  port: parseInt(process.env.PORT || '8080'),
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    '5e54e559f6d5a35bff35b38f3bda80c10da44275e0771e4d1aa9db23847fa9868f22f5870734c919c1b7e47f713d4bd318281ec6e802ba05d5ebdafeeb9950d3',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    'e5566a942d41336955fb0a0ec3c88f49c6ece0ec674eee762d934c2d0d1f306392a44524c66b2541f7ebd219fe716a912c1d0896a6669f455e277064ec3c26d7',
};
