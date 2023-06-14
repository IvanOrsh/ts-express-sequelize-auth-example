import { Sequelize } from 'sequelize-typescript';

import User from './user.model';

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

    sequelize.addModels([User]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
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
    test('should create a user with a hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
      };

      await User.create(userData as any);

      const users = await User.findAll();

      expect(users.length).toBe(1);

      expect(users[0].getDataValue('email')).toEqual('test@example.com');
      expect(users[0].getDataValue('password')).toEqual(expect.any(String));
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
  });
});
