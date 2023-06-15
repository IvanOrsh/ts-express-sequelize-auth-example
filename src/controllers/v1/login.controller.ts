import { Router, Request, Response } from 'express';

import { User, RefreshToken } from '../../models';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt-utils';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

router.post(
  '/login',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await User.comparePasswords(
      password,
      user.getDataValue('password')
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const payload = { email, password };
    const accessToken = generateAccessToken(payload);
    const savedRefreshToken = await user.$get('refreshToken');

    let refreshToken;

    if (!savedRefreshToken || !savedRefreshToken.getDataValue('token')) {
      refreshToken = generateRefreshToken(payload);

      if (!savedRefreshToken) {
        await RefreshToken.create({
          token: refreshToken,
          userId: user.id,
        } as any);
      } else {
        await user.$add('refreshToken', refreshToken); // not quite sure
      }
    } else {
      refreshToken = savedRefreshToken.getDataValue('token');
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: {
        accessToken,
        refreshToken,
      },
    });
  })
);

export default router;
