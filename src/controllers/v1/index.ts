import { Router } from 'express';

import registerRouter from './register.controller';
import loginRouter from './login.controller';

const router = Router();
router.use(registerRouter);
router.use(loginRouter);

export default router;
