import { Router } from 'express';

import registerRouter from './register.controller';

const router = Router();
router.use(registerRouter);

export default router;
