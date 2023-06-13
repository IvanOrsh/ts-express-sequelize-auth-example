import './config'; // load our environment variables
import { Database } from './database';
import { environment } from './config/environment';
import { dbConfig } from './config/database';

(async () => {
  try {
    // connect to db
    const db = new Database(environment.nodeEnv, dbConfig);
    await db.connect();
  } catch (error) {
    console.error('Something went wrong while initializing the app.', error);
  }
})();
