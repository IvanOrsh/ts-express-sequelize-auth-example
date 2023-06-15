import { Router } from 'express';

import registerRouter from './register.controller';
import loginRouter from './login.controller';
import tokenRouter from './token.controller';
import logoutRouter from './logout.controller';

const router = Router();
router.use(registerRouter);
router.use(loginRouter);
router.use(tokenRouter);
router.use(logoutRouter);

export default router;
