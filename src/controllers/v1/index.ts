import { Router } from 'express';

import registerRouter from './register.controller';
import loginRouter from './login.controller';
import tokenRouter from './token.controller';

const router = Router();
router.use(registerRouter);
router.use(loginRouter);
router.use(tokenRouter);

export default router;
