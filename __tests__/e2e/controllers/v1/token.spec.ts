import request from 'supertest';
import TestDb from '../../../test-helpers/testDb';
import { RefreshToken } from '../../../../src/models';

describe('token controller', () => {
  const testDb = new TestDb();
  const app = testDb.getApp();
  let newUserResponse: request.Response;

  const userData = {
    email: 'test@test.com',
    password: 'test123',
  };

  beforeAll(async () => {
    await testDb.start();
  });

  afterAll(async () => {
    await testDb.stop();
  });

  beforeEach(async () => {
    await testDb.sync();
    newUserResponse = await testDb.registerUser(userData);
  });

  describe('requiresAuth middleware', () => {
    test('should fail if the refresh token is invalid', async () => {
      const response = await request(app)
        .post('/v1/token')
        .set('Authorization', 'Bearer invalid.token')
        .send()
        .expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Invalid token');
    });

    test('should fail if no authorization header is present', async () => {
      const response = await request(app).post('/v1/token').send().expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Authorization header not found');
    });

    test('should fail if the authorization header is malformed', async () => {
      const response = await request(app)
        .post('/v1/token')
        .set('Authorization', 'Bearertokenmalformed')
        .send()
        .expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Bearer token malformed');
    });
  });

  test('should get a new access token successfully', async () => {
    const refreshToken = newUserResponse.body.data.refreshToken;
    const response = await request(app)
      .post('/v1/token')
      .set('Authorization', `Bearer ${refreshToken}`)
      .send()
      .expect(200);

    const { success, data } = response.body;

    expect(success).toBeTruthy();
    expect(data).toEqual({ accessToken: expect.any(String) });
  });

  test('should return 401 if there is no refresh token for the user', async () => {
    const refreshToken = newUserResponse.body.data.refreshToken;
    await RefreshToken.destroy({ where: { token: refreshToken } });

    const response = await request(app)
      .post('/v1/token')
      .set('Authorization', `Bearer ${refreshToken}`)
      .send()
      .expect(401);

    const { success, message } = response.body;

    expect(success).toBeFalsy();
    expect(message).toEqual('You must log in first');
  });
});
