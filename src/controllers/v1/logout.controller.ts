import { Router, Request, Response } from 'express';

import { LogoutService } from '../../services/logout.service';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';
import { requiresAuth } from '../../middlewares/requiresAuth';

const router = Router();

router.post(
  '/logout',
  requiresAuth('accessToken'),
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { jwt } = req.body;

    try {
      await LogoutService.logout(jwt);
      return res.status(200).json({
        success: true,
        message: 'Successfully logged out',
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
