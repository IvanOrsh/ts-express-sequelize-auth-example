# 1. Intro

**What is this about?**:

- ORM (Object Relational Mapper).
- Pattern that will allow us to test our apps easily.
- Testing Node.js app with Jest and supertest.

**What is the app that we are building?**:

- A simple authentication backend which is going to have:
  - Login
  - Logout
  - Refresh Token
  - Register

<br>

- Lots of things we would need:
  - JWT (JSON Web Tokens)
  - Sequelize
  - Testing
  - Express.js
  - Best practices!

**Our Tools**:

- Docker, Docker Compose
- Postman / REST client (vs code extension)
- DBeaver

# 2. Getting Started

## 2.1 Setting Up Development Environment

1. git (`git init`), nvm (.nvmrc file with node version, so we can `nvm use` (optional)), `npm init -y`
2. `.prettierc` for prettier config
3. dev deps: `npm i -D typescript ts-node ts-jest supertest jest eslint prettier nodemon npm-run-all rimraf @types/jest @types/node @types/supertest @typescript-eslint/eslint-plugin @typescript-eslint/parser`
4. tsconfig.json, jest.config.js, .eslintrc
5. typical scripts:

```json
"scripts": {
    "clean": "rimraf ./build",
    "build": "npm-run-all lint format test clean && tsc",
    "start": "node src",
    "local": "ts-node src",
    "local:watch": "nodemon src -e ts,json --exec 'npm run local'",
    "lint": "eslint src",
    "format": "npx prettier --write src",
    "format:check": "npx prettier --check src",
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
```

.eslintrc:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true
}
```

jest.config.js:

```js
module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testRegex: './src/.*\\.(test|spec)?\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/src'],
};
```

`test": "jest --runInBand",` - can be useful for debugging

## 2.2 Installing Dependencies:

`npm i express dotenv morgan bcrypt jsonwebtoken sequelize sequelize-typescript pg pg-hstore cls-hooked`

`npm i -D @types/morgan @types/pg @types/cls-hooked @types/bcrypt @types/validator @types/jsonwebtoken` ...more types if needed

tsconfig:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true /* Enable experimental support for TC39 stage 2 draft decorators. */,
    "emitDecoratorMetadata": true /* Emit design-type metadata for decorated declarations in source files. */
  }
}
```

# 3. Using `docker-compose` to Create Databases

- one for development
- one for testing

create `.env`, `.env.test` files (for example):

```.env
DB_PASSWORD=postgres
DB_PORT=5432
```

create `docker-compose.yaml`:

```yaml
version: '3'
services:
  postgres:
    image: postgres:13
    container_name: node-ts-sequelize-auth-example-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    ports:
      - ${DB_PORT:-5432}:5432
  postgres-test:
    image: postgres:13
    container_name: node-ts-sequelize-auth-example-test-db
    env_file:
      - .env
    environment:
      POSTGRES_PASSWORD: ${DB_TEST_PASSWORD:-postgres}
    ports:
      - ${DB_TEST_PORT:-5433}:5432
```

- `docker-compose up -d`

- to enter the container: `docker exec -it node-ts-sequelize-auth-example-db bash`

Or we can connect to our DBs using DBeaver.

# 4. Understanding JWT

- JSON Web Tokens (JWTs) are an **open standard (RFC 7519) for securely transmitting information between parties as a JSON object**.
- They are **commonly used for authentication and authorization** purposes in web applications and APIs.
- A JWT consists of three parts: a header, a payload, and a signature, separated by periods.

**Header**:

- The header typically consists of two parts: the token type, which is JWT, and the signing algorithm used to secure the token (e.g., HMAC, RSA, etc.).

**Payload**:

- The payload contains the **claims** or **statements** about the user and additional data.
- Claims can be divided into three types: registered, public, and private.
- **Registered claims** include standardized claims like "iss" (issuer), "sub" (subject), "exp" (expiration time), and more.
- **Public claims are defined by the users, while private claims are used to share information between parties**.

**Signature**:

- The signature is created by taking the encoded header, encoded payload, a secret key (known only to the server), and applying the specified signing algorithm. The signature ensures the integrity of the token and verifies that it hasn't been tampered with.

- When a user logs in or authenticates, the server generates a JWT and sends it back to the client. The client then includes the JWT in subsequent requests, typically in the **Authorization header using the Bearer scheme**. The server receives the JWT, validates its integrity by recalculating the signature, and checks the claims to ensure the token is not expired, not revoked, and authorized to access the requested resources.

- **JWTs are stateless**, meaning the server does not need to store any session information. All the necessary information is contained within the token itself. This allows for horizontal scaling and makes it easier to implement stateless authentication mechanisms.

- The security of JWTs depends on the implementation and various factors such as the choice of signing algorithm, key management practices, token lifetime, and handling of sensitive data. When used correctly, JWTs can provide a secure means of authentication. However, it's important to follow best practices, such as using strong cryptographic algorithms, securely storing and managing keys, and carefully validating and verifying the tokens.

- It's worth noting that JWTs are not inherently secure. Mishandling or insecure implementation can lead to security vulnerabilities, such as token leakage, token tampering, or replay attacks. Therefore, it's crucial to understand and follow best practices to ensure the security of your JWT-based authentication system.

# 5. Understanding Bcrypt

**Hashing**:

- A hash function is a mathematical function that takes an input (in this case, a password or any data) and produces a fixed-size string of characters, which is the hash value or hash code.
- The hash function is designed to be computationally efficient and irreversible, meaning it should be difficult to derive the original input from the hash value.
- In server authentication, passwords are typically hashed and stored in a database instead of storing the actual passwords in plain text.When a user attempts to authenticate, their provided password is hashed and compared to the stored hashed value. If the hashes match, the password is considered correct.

**Salt**:

- A salt is a random value appended to the password before hashing. The purpose of a salt is to **add uniqueness and complexity** to the hashed password.
- Each user's password can have a different salt, ensuring that even if two users have the same password, their hashed values will be different.
- Salting helps protect against precomputed attacks (rainbow table attacks) where an attacker could use precomputed hash values for commonly used passwords. By using a unique salt for each user, the attacker would need to generate and store a separate set of precomputed hashes for each salt, which significantly increases the complexity of the attack.

**bcrypt**:

- bcrypt is a widely used algorithm for hashing passwords.
- It incorporates both hashing and salting techniques, making it a secure choice for password storage.
- bcrypt uses a variant of the Blowfish encryption algorithm and introduces a work factor or cost factor, which determines the computational complexity of the hashing process. Increasing the work factor makes the hashing process slower, which helps protect against brute-force attacks. bcrypt automatically handles the generation and management of salts, making it convenient for developers to use without worrying about the details of salt generation and storage.

# 6. Adding Environment Variables

1. modify scripts - something like `"local": "NODE_ENV=development ts-node src",`
2. src/config/environment.ts:

```ts
export const environment = {
  port: parseInt(process.env.PORT || '8080'),
  nodeEnv: process.env.NODE_ENV || 'production',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10'),
  jwtAccessTokenSecret:
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    '5e54e559f6d5a35bff35b38f3bda80c10da44275e0771e4d1aa9db23847fa9868f22f5870734c919c1b7e47f713d4bd318281ec6e802ba05d5ebdafeeb9950d3',
  jwtRefreshTokenSecret:
    process.env.JWT_REFRESH_TOKEN_SECRET ||
    'e5566a942d41336955fb0a0ec3c88f49c6ece0ec674eee762d934c2d0d1f306392a44524c66b2541f7ebd219fe716a912c1d0896a6669f455e277064ec3c26d7',
};
```

3. database.ts:

```ts
export const development = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'postgres',
  dialect: 'postgres',
};

export const test = {
  username: process.env.DB_TEST_USERNAME || 'postgres',
  password: process.env.DB_TEST_PASSWORD || 'postgres',
  host: process.env.DB_TEST_HOST || 'localhost',
  port: parseInt(process.env.DB_TEST_PORT || '5433'),
  database: process.env.DB_TEST_DATABASE || 'postgres',
  dialect: 'postgres',
};
```

# 7. Utils

## 7.1 jwt-utils

src/utils/jwt-utils.ts:

```ts
import { SignOptions, sign, verify } from 'jsonwebtoken';

import { environment } from '../config/environment';

export function generateAccessToken(
  payload: string | Buffer | object,
  options: SignOptions = {}
) {
  const { expiresIn = '1d' } = options;

  return sign(payload, environment.jwtAccessTokenSecret, { expiresIn });
}

export function generateRefreshToken(payload: string | Buffer | object) {
  return sign(payload, environment.jwtRefreshTokenSecret);
}

export function verifyAccessToken(accessToken: string) {
  return verify(accessToken, environment.jwtAccessTokenSecret);
}

export function verifyRefreshToken(refreshToken: string) {
  return verify(refreshToken, environment.jwtRefreshTokenSecret);
}
```

and we can test our functions with something like this:

```ts
import { JsonWebTokenError } from 'jsonwebtoken';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from './jwt-utils';

describe('Testing JWT utilities', () => {
  test('generateAccessToken should return an access token', () => {
    const payload = { email: 'test@test.com' };

    expect(generateAccessToken(payload)).toEqual(expect.any(String));
  });

  test('generateRefreshToken should return a refresh token', () => {
    const payload = { email: 'test@test.com' };

    expect(generateRefreshToken(payload)).toEqual(expect.any(String));
  });

  describe('verifyAccessToken', () => {
    test('should verify that the access token is valid', () => {
      const payload = { email: 'test@test.com' };
      const jwt = generateAccessToken(payload);

      expect(verifyAccessToken(jwt)).toEqual(expect.objectContaining(payload));
    });

    test('should throw error if the refresh token is invalid', () => {
      expect(() => verifyAccessToken('invalid_token')).toThrow(
        JsonWebTokenError
      );
    });
  });

  describe('verifyRefreshToken', () => {
    test('verifyRefreshToken should verify that the refresh token is valid', () => {
      const payload = { email: 'test@test.com' };
      const jwt = generateRefreshToken(payload);

      expect(verifyRefreshToken(jwt)).toEqual(expect.objectContaining(payload));
    });

    test('should throw error if the refresh token is invalid', () => {
      expect(() => verifyRefreshToken('invalid_token')).toThrow(
        JsonWebTokenError
      );
    });
  });
});
```

## 7.2 password-utils

src/utils/password-utils.ts:

```ts
import { hash, compare } from 'bcrypt';

import { environment } from '../config/environment';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, environment.saltRounds);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}
```

# 8. Abstracting Database Connection

## 8.1 Creating Database class

- This is our database connection abstraction.

src/database.index.ts:

```ts
import { Sequelize } from 'sequelize-typescript';

import { dbType } from '../config/database';

export class Database {
  isTestEnvironment: boolean;
  connection: Sequelize | null = null;

  constructor(public readonly environment: string, public readonly db: dbType) {
    this.isTestEnvironment = this.environment === 'test';
  }

  getConnectionString() {
    const { username, password, host, port, database } =
      this.db[this.environment as keyof dbType];

    return `postgres://${username}:${password}@${host}:${port}/${database};`;
  }

  async connect() {
    const uri = this.getConnectionString();

    this.connection = new Sequelize(uri, {
      logging: this.isTestEnvironment ? false : console.log,
    });

    // check if we connected successfully
    await this.connection.authenticate({ logging: false });

    if (!this.isTestEnvironment) {
      console.log('Connection has been established successfully');
    }

    // register the models

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
```

## 8.2 Registering Models

1. create models

src/models/index.ts:

```ts
import fs from 'fs';
import path from 'path';

import { Sequelize } from 'sequelize-typescript';

let models: { [key: string]: any } = {
  //   User: User,
  //   RefreshToken: RefreshToken,
  //   Role: Role,
  //   sequelize: sequelize,
};

function registerModels(sequelize: Sequelize): void {
  const thisFile = path.basename(__filename); // index.ts

  // Read model files from the models directory
  fs.readdirSync(__dirname)
    .filter((file) => file !== thisFile && (file.slice(-3) === '.js' || '.ts')) // Filter TypeScript files
    .forEach((file) => {
      const modelPath = path.join(__dirname, file);
      const model = require(modelPath).default;

      if (model && model !== sequelize.models[model.name]) {
        sequelize.addModels([model]);
      }
    });

  // Define associations between models if needed
  // Example:
  // const { User, Role } = sequelize.models;
  // User.belongsTo(Role);
}

export { registerModels, models };
```

and now call this function in our database connection abstraction (`Database`):

src/database.index.ts:

```ts
import { registerModels } from '../models';

export class Database {
  // ...fields

  // ...constructor

  // ...getConnectionString

  async connect() {
    const uri = this.getConnectionString();

    this.connection = new Sequelize(uri, {
      logging: this.isTestEnvironment ? false : console.log,
    });

    await this.connection.authenticate({ logging: false });

    if (!this.isTestEnvironment) {
      console.log('Connection has been established successfully');
    }

    // REGISTERING MODELS!
    registerModels(this.connection);

    // sync the models
    await this.sync();
  }

  // other methods
}
```

# 8. Creating the Server

1. src/config/index.ts - load our environment variables using `dotenv.config`:

```ts
import { config } from 'dotenv';

config();
```

2. src/server.ts:

```ts
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
```

# 9. Creating Utilities for Tests

src/utils/tests-utils.ts:

```ts
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
```

# 10 `User` model

## 10.1 `user.model.ts`:

src/models/user.model.ts:

```ts
import { hash, compare } from 'bcrypt';
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeSave,
  Index,
  BeforeCreate,
} from 'sequelize-typescript';

import { environment } from '../config/environment';

@Table({ modelName: 'User' })
class User extends Model<User> {
  @Index
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email',
    validate: {
      isEmail: {
        msg: 'Not a valid email address',
      },
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    field: 'username',
  })
  username?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'password',
  })
  password!: string;

  @Column({
    type: DataType.STRING(50),
    field: 'firstName',
    validate: {
      len: {
        args: [0, 50],
        msg: 'First name has too many characters',
      },
    },
  })
  firstName!: string;

  @Column({
    type: DataType.STRING(50),
    field: 'lastName',
    validate: {
      len: {
        args: [0, 50],
        msg: 'Last name has too many characters',
      },
    },
  })
  lastName!: string;

  @BeforeSave
  @BeforeCreate
  static async hashPassword(instance: User): Promise<void> {
    const hashedPassword = await hash(
      instance.dataValues.password,
      environment.saltRounds
    );
    instance.dataValues.password = hashedPassword;
  }

  static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}

export default User;
```

## 10.2 `user.spec.ts`:

- TODO: find better way to test models!

```ts
import { Sequelize } from 'sequelize-typescript';

import User from './user.model';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite' as const,
      database: 'some_db',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([User]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('static methods', () => {
    describe('hashPassword', () => {
      test('should encrypt the password correctly', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        expect(user.dataValues.password).toEqual(expect.any(String));
        expect(user.dataValues.password).not.toEqual(userData.password);
      });
    });

    describe('comparePasswords', () => {
      test('should return true if the hashed password is the same as the original password ', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        const result = await User.comparePasswords(
          userData.password,
          user.dataValues.password
        );

        expect(result).toBeTruthy();
      });

      test('should return false if the hashed password is not the same as the original password ', async () => {
        const userData = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
          firstName: 'John',
          lastName: 'Doe',
        };
        const user = new User(userData as any);
        await User.hashPassword(user);
        const result = await User.comparePasswords(
          'password1233',
          user.dataValues.password
        );

        expect(result).toBeFalsy();
      });
    });
  });

  describe('hooks', () => {
    test('should create a user with a hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
      };

      await User.create(userData as any);

      const users = await User.findAll();

      expect(users.length).toBe(1);

      expect(users[0].getDataValue('email')).toEqual('test@example.com');
      expect(users[0].getDataValue('password')).toEqual(expect.any(String));
      expect(users[0].getDataValue('password')).not.toEqual(userData.password);
      expect(users[0].getDataValue('username')).toEqual('testuser');
      expect(users[0].getDataValue('firstName')).toEqual('John');
      expect(users[0].getDataValue('lastName')).toEqual('Doe');

      expect(
        User.comparePasswords(
          userData.password,
          users[0].getDataValue('password')
        )
      ).toBeTruthy();
    });
  });
});
```

# 11 `Role` model

## 11.1 `userRole.model.ts`:

```ts
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import User from './user.model';
import Role from './role.model';

@Table({ modelName: 'UserRole' })
class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  roleId!: number;
}

export default UserRole;
```

## 11.2 `role.model.ts`:

```ts
import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';

import User from './user.model';
import UserRole from './userRole.model';

@Table({ modelName: 'Role' })
class Role extends Model<Role> {
  @Column({
    type: DataType.STRING,
  })
  role!: string;

  @BelongsToMany(() => User, () => UserRole)
  user!: User;

  static getAllowedRoles(): string[] {
    return ['Admin', 'User', 'Guest'];
  }
}

export default Role;
```

## 11.3 update `user.model.ts` and `user.spec.ts`

src/models/user.model.ts:

```ts
@Table({ modelName: 'User' })
class User extends Model<User> {
  // ...rest of User

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

  // ...static methods

  static async createWithDefaultRole(userData: any): Promise<User> {
    const user = await User.create(userData);
    const defaultRole = await Role.findOne({ where: { role: 'Guest' } }); // Assuming 'Default' is the name of the default role
    if (defaultRole) {
      await user.$add('role', defaultRole); // Assign the default role to the user
    }
    return user;
  }
}
```

- update user.spec.ts:

```ts
import { Sequelize } from 'sequelize-typescript';

import User from './user.model';
import Role from './role.model';
import UserRole from './userRole.model';

describe('User Model', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite' as const,
      database: 'some_db',
      username: 'root',
      password: '',
      storage: ':memory:',
      logging: false,
    });

    sequelize.addModels([Role, UserRole, User]);

    await sequelize.sync();
  });

  beforeEach(async () => {
    // populate db with roles
    const rolesData = Role.getAllowedRoles().map((role) => ({
      role,
    }));
    await Role.bulkCreate(rolesData as any);
  });

  afterEach(async () => {
    await Role.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  // do the testing...
});
```

# 13. Refactoring to use Decorators with Sequelize

- In order to use decorators:
  - check `tsconfig.json` for `"experimentalDecorators": true` and `"emitDecoratorMetadata": true`
  - make sure you install: `sequelize sequelize-typescript reflect-metadata`
- Define your models using decorators. For example, let's say you have a User model:

```ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  email!: string;

  // ... other columns and associations
}
```

- Create a separate file, let's say `sequelize.ts`, where you initialize Sequelize and define the models:

```ts
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres', // replace with your database dialect
  logging: false,
});

export const models = [User]; // Array of all your models

export default sequelize;
```

- Now we can refactor our `Database` class and update it to use decorators:

```ts
import { Sequelize } from 'sequelize-typescript';
import { models } from './sequelize';

export class Database {
  private readonly sequelize: Sequelize;

  constructor(private readonly environment: string) {
    this.sequelize = new Sequelize('database', 'username', 'password', {
      dialect: 'mysql', // replace with your database dialect
      logging: false,
    });

    // Register models
    this.sequelize.addModels(models);
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully');
      await this.sequelize.sync({ force: false });
      console.log('Models synchronized successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      console.log('Connection closed successfully');
    } catch (error) {
      console.error('Failed to close the connection:', error);
    }
  }
}
```

- In this updated version, the `Database` class initializes Sequelize within its constructor and registers the models using the addModels method of Sequelize. The connect method authenticates the connection and synchronizes the models, while the disconnect method closes the connection.

- Now we can create an instance of the Database class and use it to connect to and disconnect from the database:

```ts
const database = new Database('development');
await database.connect();
// Use the Sequelize models and perform database operations
await database.disconnect();
```
