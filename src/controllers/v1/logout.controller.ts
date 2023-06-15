import { Router, Request, Response } from 'express';

import { LoginService } from '../../services/login.service';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';
import { requiresAuth } from '../../middlewares/requiresAuth';

import { User, RefreshToken } from '../../models';

const router = Router();

router.post(
  '/logout',
  requiresAuth('accessToken'),
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { jwt } = req.body;
    const user = await User.findOne({
      where: { email: jwt.email },
      include: RefreshToken,
    });
    user?.refreshToken.setDataValue('token', undefined);
    return res.status(200).json({
      success: true,
      message: 'Successfully logged out',
    });
  })
);

export default router;
