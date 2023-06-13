import '../config'; // load evn variables
import { Database } from '../database';
import { dbConfig } from '../config/database';
import { environment } from '../config/environment';

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
