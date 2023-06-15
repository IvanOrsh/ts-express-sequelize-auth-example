import { Express } from 'express';
import request from 'supertest';
import { startDb, syncDb, stopDb, getApp } from '../../../utils/tests-utils';
import { User, Role } from '../../../models';
import {
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../utils/jwt-utils';

describe('register', () => {
  let app: Express;

  beforeAll(async () => {
    await startDb();
    app = getApp();
  });

  afterAll(async () => {
    await stopDb();
  });

  beforeEach(async () => {
    await syncDb(); // to force clean db before each test
  });

  test('should register a new user successfully', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
    };
    await request(app).post('/v1/register').send(userData).expect(200);

    const users = await User.findAll();

    expect(users.length).toBe(1);
    expect(users[0].getDataValue('email')).toEqual(userData.email);
  });

  test('should register a new user successfully with roles', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };
    await request(app).post('/v1/register').send(userData).expect(200);

    const users = await User.findAll({ include: Role });
    // const user = users[0];

    // const roles = await user.$get('roles');
    // expect(roles!.map((role: Role) => role.getDataValue('role'))).toEqual(
    //   userData.roles
    // );

    expect(users[0].roles.map((role) => role.getDataValue('role'))).toEqual(
      userData.roles
    );

    expect(users.length).toBe(1);
    expect(users[0].getDataValue('email')).toEqual(userData.email);
  });

  test('should not create a new user if it already exists', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };

    await request(app).post('/v1/register').send(userData).expect(200);
    const response = await request(app).post('/v1/register').send(userData);

    expect(response.body).toEqual({
      success: false,
      message: 'User already exists',
    });
  });

  test('should create a new user with a valid access / refresh token', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };

    const response = await request(app).post('/v1/register').send(userData);

    const {
      data: { accessToken, refreshToken },
    } = response.body;

    expect(verifyAccessToken(accessToken)).toBeTruthy();
    expect(verifyRefreshToken(refreshToken)).toBeTruthy();
  });
});
