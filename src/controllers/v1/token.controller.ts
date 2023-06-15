import { Response, Request, Router } from 'express';

import { runAsyncWrapper } from '../../utils/runAsyncWrapper';
import { requiresAuth } from '../../middlewares/requiresAuth';
import { TokenService } from '../../services/token.service';

const router = Router();

router.post(
  '/token',
  requiresAuth('refreshToken'),
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { jwt } = req.body;

    try {
      const { accessToken } = await TokenService.generateAccessToken(jwt);
      return res.status(200).json({
        success: true,
        data: {
          accessToken,
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
