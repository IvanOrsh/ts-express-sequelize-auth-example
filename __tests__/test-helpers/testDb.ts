import request from 'supertest';

import { Database } from '../../src/database';
import { dbConfig } from '../../src/config/database';
import App from '../../src/app';

type Options = {
  email?: string;
  password?: string;
  endpoint?: string;
};

export default class TestDb {
  private db: Database;

  constructor() {
    this.db = new Database('test', dbConfig);
  }

  async start(): Promise<void> {
    await this.db.connect();
  }

  async sync(): Promise<void> {
    await this.db.sync();
  }

  async stop(): Promise<void> {
    await this.db.disconnect();
  }

  getApp() {
    return new App().getApp();
  }

  async registerUser(options: Options = {}) {
    const {
      email = 'test@test.com',
      password = 'Test123',
      endpoint = '/v1/register',
    } = options;

    return request(this.getApp()).post(endpoint).send({ email, password });
  }
}
