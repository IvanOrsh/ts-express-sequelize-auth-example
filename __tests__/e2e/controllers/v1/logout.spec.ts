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

  test('test', () => {
    expect(true).toBeTruthy();
  });
});
