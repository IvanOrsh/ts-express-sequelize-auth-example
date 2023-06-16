import { RefreshToken, User } from '../models';

export class LogoutService {
  static async logout(jwt: any) {
    const user = await User.findOne({
      where: { email: jwt.email },
      include: RefreshToken,
    });

    if (!user || !user.refreshToken) {
      throw new Error('User not found or refresh token missing');
    }

    await user.refreshToken.setDataValue('token', null);
    await user.refreshToken.save();
  }
}
