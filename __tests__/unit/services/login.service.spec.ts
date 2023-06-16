import { LoginService } from '../../../src/services/login.service';
import { User, RefreshToken } from '../../../src/models';

jest.mock('../../../src/models', () => {
  type InputType = {
    where: {
      email: string;
    };
  };

  const mockUser = {
    findOne: jest.fn((input: InputType) => {
      const {
        where: { email },
      } = input;

      if (email !== 'test@example.com') {
        return null;
      }

      return {
        getDataValue: (arg: string) => {
          switch (arg) {
            case 'password':
              return 'hashedPassword';
            case 'email':
              return email;
            default:
              return arg;
          }
        },
        $get: (arg: any) => RefreshToken.findOne({ where: { userId: 1 } }),
        $add: (arg: string) => {},
      };
    }),

    comparePasswords: jest.fn(
      (password: string, hashedPassword: string) =>
        password === 'password123' && hashedPassword === 'hashedPassword'
    ),
  };

  const mockRefreshToken = {
    create: jest.fn(),
    findOne: jest.fn((token: string) => ({
      getDataValue: (arg: string) => 'refreshToken',
      $get: (arg: string) => arg,
    })),
  };

  return {
    User: mockUser,
    RefreshToken: mockRefreshToken,
  };
});

describe('LoginService', () => {
  const user = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock function calls before each test
  });

  test('should login successfully when provided with valid credentials', async () => {
    const result = await LoginService.login(user.email, user.password);

    const { accessToken, refreshToken } = result;

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(User.comparePasswords).toHaveBeenCalledWith(
      user.password,
      'hashedPassword'
    );
    expect(result).toEqual({ accessToken, refreshToken });
  });

  test('should throw if user was not found', async () => {
    try {
      const result = await LoginService.login('invalid email', user.password);
    } catch (err) {
      const error = err as Error;
      expect(error.message).toBe('Invalid credentials');
    }

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'invalid email' },
    });
  });

  test('should throw if password is invalid', async () => {
    try {
      const result = await LoginService.login(user.email, 'invalid password');
    } catch (err) {
      const error = err as Error;
      expect(error.message).toBe('Invalid credentials');
    }

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: user.email },
    });
    expect(User.comparePasswords).toBeCalledWith(
      'invalid password',
      'hashedPassword'
    );
  });
});
