import '../../../src/config';

import { Sequelize } from 'sequelize-typescript';

import User from '../../../src/models/user.model';
import Role from '../../../src/models/role.model';
import UserRole from '../../../src/models/userRole.model';
import RefreshToken from '../../../src/models/refreshToken.model';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite' as const,
      database: 'some_db',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([Role, UserRole, User, RefreshToken]);

    await sequelize.sync();
  });

  beforeEach(async () => {
    // populate db with roles
    const rolesData = Role.getAllowedRoles().map((role) => ({
      role,
    }));
    await Role.bulkCreate(rolesData as any);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('static methods', () => {
    describe('hashPassword', () => {
      test('should encrypt the password correctly', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        expect(user.dataValues.password).toEqual(expect.any(String));
        expect(user.dataValues.password).not.toEqual(userData.password);
      });
    });

    describe('comparePasswords', () => {
      test('should return true if the hashed password is the same as the original password ', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        const result = await User.comparePasswords(
          userData.password,
          user.dataValues.password
        );

        expect(result).toBeTruthy();
      });

      test('should return false if the hashed password is not the same as the original password ', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        const result = await User.comparePasswords(
          'password1233',
          user.dataValues.password
        );

        expect(result).toBeFalsy();
      });
    });
  });

  describe('hooks', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
    };

    afterEach(async () => {
      await User.destroy({ where: {} });
    });

    test('should create a user with a correctly hashed password', async () => {
      await User.createWithDefaultRole(userData as any);
      const users = await User.findAll();

      expect(users.length).toBe(1);

      expect(users[0].getDataValue('email')).toEqual('test@example.com');
      expect(users[0].getDataValue('password')).toEqual(expect.any(String));
      expect(users[0].getDataValue('password')).not.toEqual(userData.password);
      expect(users[0].getDataValue('password')).not.toEqual(userData.password);
      expect(users[0].getDataValue('username')).toEqual('testuser');
      expect(users[0].getDataValue('firstName')).toEqual('John');
      expect(users[0].getDataValue('lastName')).toEqual('Doe');

      expect(
        User.comparePasswords(
          userData.password,
          users[0].getDataValue('password')
        )
      ).toBeTruthy();
    });

    test('should create a refresh token for the new user', async () => {
      // Create the user with default role and refresh token
      const user = await User.createWithDefaultRole(userData);

      // Get the associated refresh token
      const refreshToken = await RefreshToken.findOne({
        where: { userId: user.id },
      });

      // Assertions
      expect(refreshToken).toBeDefined();
      expect(refreshToken?.getDataValue('token')).toBeTruthy();
      expect(refreshToken?.getDataValue('userId')).toBe(user.id);
    });
  });
});
