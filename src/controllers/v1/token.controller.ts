import { Response, Request, Router } from 'express';

import { runAsyncWrapper } from '../../utils/runAsyncWrapper';
import { requiresAuth } from '../../middlewares/requiresAuth';
import { RefreshToken, User } from '../../models';
import { generateAccessToken } from '../../utils/jwt-utils';

const router = Router();

router.post(
  '/token',
  requiresAuth('refreshToken'),
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { jwt } = req.body;

    const user = await User.findOne({
      where: { email: jwt.email },
      include: RefreshToken,
    });
    const savedToken = user?.refreshToken;

    if (!savedToken || !savedToken.getDataValue('token')) {
      return res.status(401).json({
        success: false,
        message: 'You must log in first',
      });
    }

    const payload = { email: user.getDataValue('email') };
    const newAccessToken = generateAccessToken(payload);
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  })
);

export default router;
