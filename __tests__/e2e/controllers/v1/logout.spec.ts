import request from 'supertest';
import TestDb from '../../../test-helpers/testDb';
import { RefreshToken, User } from '../../../../src/models';

describe('logout controller', () => {
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
    test('should fail if the access token is invalid', async () => {
      const response = await request(app)
        .post('/v1/logout')
        .set('Authorization', `Bearer invalid.token`)
        .send()
        .expect(401);

      const { success, message } = response.body;

      expect(success).toBeFalsy();
      expect(message).toBe('Invalid token');
    });
  });

  test('should successfully logout a user when provided with valid access token', async () => {
    const accessToken = newUserResponse.body.data.accessToken;
    const response = await request(app)
      .post('/v1/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    const { success, message } = response.body;

    expect(success).toBeTruthy();
    expect(message).toBe('Successfully logged out');

    const user = await User.findOne({
      where: { email: userData.email },
      include: RefreshToken,
    });
    expect(user!.refreshToken.getDataValue('token')).toEqual(null);
  });
});
