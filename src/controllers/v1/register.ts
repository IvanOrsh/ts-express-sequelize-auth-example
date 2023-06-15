import { Request, Response, Router } from 'express';
import { User, Role, UserRole, RefreshToken } from '../../models';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt-utils';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

// sign up
router.post(
  '/register',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password, roles } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User already exists',
      });
    }

    try {
      const newUser = await User.create({ email, password } as any);
      const jwtPayload = {
        email: newUser.getDataValue('email'),
        password: newUser.getDataValue('password'),
      };
      const accessToken = generateAccessToken(jwtPayload);
      const refreshToken = generateRefreshToken(jwtPayload);
      await RefreshToken.create({
        token: refreshToken,
        userId: newUser.id,
      } as any);

      if (roles && Array.isArray(roles)) {
        const rolesToSave = [];

        for (const role of roles) {
          const newRole = await Role.create({ role } as any);
          await newUser.$add('role', newRole);
        }
      }

      return res.json({
        success: true,
        message: 'User successfully registered',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
