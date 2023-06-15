import { Router, Request, Response } from 'express';

import { LoginService } from '../../services/login.service';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

router.post(
  '/login',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await LoginService.login(
        email,
        password
      );
      return res.status(200).json({
        success: true,
        message: 'Successfully logged in',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      const error = err as Error;
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
