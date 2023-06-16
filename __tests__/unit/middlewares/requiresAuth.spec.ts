import express from 'express';
import request from 'supertest';
import { requiresAuth } from '../../../src/middlewares/requiresAuth';
import { runAsyncWrapper } from '../../../src/utils/runAsyncWrapper';

jest.mock('../../../src/utils/jwt-utils', () => {
  return {
    verifyAccessToken: (token: string) => {
      if (token === 'valid.token') return { email: 'valid@email.com' };
      throw 'invalid token';
    },
  };
});

describe('requiresAuth middleware', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express(); // Create your Express app instance
    app.use(express.json());
    app.post(
      '/',
      requiresAuth('accessToken'),
      runAsyncWrapper(async (req: express.Request, res: express.Response) => {
        return res.status(200).json({
          success: true,
          message: 'Success',
        });
      })
    );
  });

  describe('requiresAuth middleware', () => {
    test('should fail if the refresh token is invalid', async () => {
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer invalid.token')
        .send()
        .expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Invalid token');
    });

    test('should fail if no authorization header is present', async () => {
      const response = await request(app).post('/').send().expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Authorization header not found');
    });

    test('should fail if the authorization header is malformed', async () => {
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearertokenmalformed')
        .send()
        .expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Bearer token malformed');
    });

    test('should call next() if token is valid', async () => {
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid.token')
        .send();

      const { success, message } = response.body;

      expect(success).toBeTruthy();
      expect(message).toBe('Success');
    });
  });
});
