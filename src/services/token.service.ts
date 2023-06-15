import { User, RefreshToken } from '../models';
import { generateAccessToken } from '../utils/jwt-utils';

export class TokenService {
  static async generateAccessToken(jwt: any) {
    const user = await User.findOne({
      where: { email: jwt.email },
      include: RefreshToken,
    });
    const savedToken = user?.refreshToken;

    if (!savedToken || !savedToken.getDataValue('token')) {
      throw new Error('You must log in first');
    }

    const payload = { email: user.getDataValue('email') };
    const newAccessToken = generateAccessToken(payload);
    return {
      accessToken: newAccessToken,
    };
  }
}
