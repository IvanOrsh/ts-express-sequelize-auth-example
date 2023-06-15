import { Request, Response, Router } from 'express';

import { RegisterService } from '../../services/register.service';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

// sign up
router.post(
  '/register',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password, roles } = req.body;

    try {
      const { accessToken, refreshToken } = await RegisterService.registerUser(
        email,
        password,
        roles
      );

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
