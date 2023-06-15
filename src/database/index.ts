import { Sequelize } from 'sequelize-typescript';
import cls from 'cls-hooked';

import { dbType } from '../config/database';
import { registerModels } from '../models';

export class Database {
  isTestEnvironment: boolean;
  connection: Sequelize | null = null;

  constructor(public readonly environment: string, public readonly db: dbType) {
    this.isTestEnvironment = this.environment === 'test';
  }

  getConnectionString() {
    const { username, password, host, port, database } =
      this.db[this.environment as keyof dbType];

    return `postgres://${username}:${password}@${host}:${port}/${database}`;
  }

  async connect() {
    // enable CLS
    const namespace = cls.createNamespace('sequelize-transactions');
    Sequelize.useCLS(namespace);

    const uri = this.getConnectionString();

    this.connection = new Sequelize(uri, {
      logging: this.isTestEnvironment ? false : console.log,
    });

    // check if we connected successfully
    await this.connection.authenticate({ logging: false });

    if (!this.isTestEnvironment) {
      console.log('Successfully connected to the database');
    }

    // register the models
    registerModels(this.connection);

    // sync the models
    await this.sync();
  }

  async sync() {
    await this.connection?.sync({
      force: this.isTestEnvironment,
      logging: false,
    });

    if (!this.isTestEnvironment) {
      console.log('Models synchronized successfully');
    }
  }

  async disconnect() {
    await this.connection?.close();
  }
}
