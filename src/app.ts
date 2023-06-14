import express from 'express';
import logger from 'morgan';

import { environment } from './config/environment';
import { errorMiddleware } from './middlewares/errors';

class App {
  app: express.Express;
  constructor() {
    this.app = express();
    this.app.use(
      logger('dev', {
        skip: (req: express.Request, res: express.Response) =>
          environment.nodeEnv === 'test',
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.setRoutes();
  }

  setRoutes() {
    this.app.use(errorMiddleware);
  }

  getApp() {
    return this.app;
  }

  listen() {
    const { port } = environment;
    this.app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  }
}

export default App;
