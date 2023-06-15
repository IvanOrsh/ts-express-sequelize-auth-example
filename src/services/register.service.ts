import { User, Role, UserRole, RefreshToken } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt-utils';

export class RegisterService {
  static async registerUser(email: string, password: string, roles: string[]) {
    const user = await User.findOne({ where: { email } });

    if (user) {
      throw new Error('User already exists');
    }

    const transaction = await User.sequelize!.transaction();

    try {
      const newUser = await User.create({ email, password } as any, {
        transaction,
      });
      const jwtPayload = {
        email: newUser.getDataValue('email'),
      };
      const accessToken = generateAccessToken(jwtPayload);
      const refreshToken = generateRefreshToken(jwtPayload);

      await RefreshToken.create(
        {
          token: refreshToken,
          userId: newUser.id,
        } as any,
        { transaction }
      );

      if (roles && Array.isArray(roles)) {
        for (const role of roles) {
          const newRole = await Role.create({ role } as any, { transaction });
          await newUser.$add('role', newRole, { transaction });
        }
      }

      await transaction.commit();

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
