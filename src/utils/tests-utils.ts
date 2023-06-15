import request from 'supertest';

import '../config'; // load evn variables
import { Database } from '../database';
import { dbConfig } from '../config/database';
import App from '../app';

type Options = {
  email?: string;
  password?: string;
  endpoint?: string;
};

let db: Database;

export async function startDb(): Promise<Database> {
  db = new Database('test', dbConfig);
  await db.connect();
  return db;
}

export async function stopDb(): Promise<void> {
  await db.disconnect();
}

export async function syncDb(): Promise<void> {
  await db.sync();
}

export function getApp() {
  return new App().getApp();
}

export async function registerUser(options: Options = {}) {
  const {
    email = 'test@test.com',
    password = 'Test123',
    endpoint = '/v1/register',
  } = options;

  return request(getApp).post(endpoint).send({ email, password });
}
