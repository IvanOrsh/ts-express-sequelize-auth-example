import { User, RefreshToken } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt-utils';

export class LoginService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await User.comparePasswords(
      password,
      user.getDataValue('password')
    );

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const payload = { email };
    const accessToken = generateAccessToken(payload);
    const savedRefreshToken = await RefreshToken.findOne({
      where: { userId: user.id },
    });

    let refreshToken;

    if (!savedRefreshToken || !savedRefreshToken.getDataValue('token')) {
      refreshToken = generateRefreshToken(payload);

      if (!savedRefreshToken) {
        await RefreshToken.create({
          token: refreshToken,
          userId: user.id,
        } as any);
      } else {
        savedRefreshToken.setDataValue('token', refreshToken);
        await savedRefreshToken.save();
      }
    } else {
      refreshToken = savedRefreshToken.getDataValue('token');
    }

    return {
      accessToken,
      refreshToken,
    };
  }
}
