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
  - Best practices (not really)

**Our Tools**:

- Docker, Docker Compose
- Postman / REST client (vs code extension) (optional)
- DBeaver (optional)

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

# 9. Creating the Server

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

# 10. Creating Utilities for Tests

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

# 11. `User` model

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

# 12. `Role` model

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

# 13. `RefreshToken` model

- one-to-one with `User` model

src/models/refreshToken.model.ts:

```ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import User from './user.model';

@Table({ modelName: 'RefreshToken' })
class RefreshToken extends Model<RefreshToken> {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  token!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default RefreshToken;
```

- update `user.model.ts` accordingly:

```ts
  @HasOne(() => RefreshToken)
  refreshToken!: RefreshToken;
```

# 14. `App`

src/app.ts:

```ts
import express from 'express';
import logger from 'morgan';

import { environment } from './config/environment';

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

  setRoutes() {}

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
```

# 15. Utility function `runAsyncWrapper` and Middleware `errorMiddleware`

```ts
import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

function runAsyncWrapper(
  callback: AsyncHandler
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}
```

```ts
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Error middleware]:\n', err.stack);
  res.status(err.statusCode || 500);

  // Send the error response
  res.json({
    error: {
      message: err.message,
      stack:
        process.env.NODE_ENV === 'production'
          ? 'Sorry, an error occurred.'
          : err.stack, // Show the error stack only in development mode
    },
  });
}
```

# 16. Auth Middleware

```ts
import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt-utils';

type TokenType = 'refreshToken' | 'accessToken';

export function requiresAuth(tokenType: TokenType) {
  return function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      // Bearer token
      try {
        var [bearer, token] = authHeader.split(' '); // using var, so that token is in a function scope

        if (bearer.toLowerCase() !== 'bearer' || !token) {
          throw Error;
        }
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: 'Bearer token malformed',
        });
      }
    } else {
      return res.status(401).json({
        success: false,
        message: 'Authorization header not found',
      });
    }

    // verifying
    try {
      let jwt;
      switch (tokenType) {
        case 'accessToken':
          jwt = verifyRefreshToken(token);
          break;
        case 'refreshToken':
        default:
          jwt = verifyAccessToken(token);
          break;
      }

      req.body.jwt = jwt;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  };
}
```

# 17. Adding Register Controller

## 17.1 `register.controller`

```ts
import { Request, Response, Router } from 'express';
import { User, Role, UserRole, RefreshToken } from '../../models';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt-utils';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

// sign up
router.post(
  '/register',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password, roles } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User already exists',
      });
    }

    try {
      const newUser = await User.create({ email, password } as any);
      const jwtPayload = {
        email: newUser.getDataValue('email'),
        password: newUser.getDataValue('password'),
      };
      const accessToken = generateAccessToken(jwtPayload);
      const refreshToken = generateRefreshToken(jwtPayload);
      await RefreshToken.create({
        token: refreshToken,
        userId: newUser.id,
      } as any);

      if (roles && Array.isArray(roles)) {
        const rolesToSave = [];

        for (const role of roles) {
          const newRole = await Role.create({ role } as any);
          await newUser.$add('role', newRole);
        }
      }

      return res.json({
        success: true,
        message: 'User successfully registered',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
```

## 17.2 Testing `register.controller`

```ts
import { Express } from 'express';
import request from 'supertest';
import { startDb, syncDb, stopDb, getApp } from '../../../utils/tests-utils';
import { User, Role } from '../../../models';
import {
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../utils/jwt-utils';

describe('register', () => {
  let app: Express;

  beforeAll(async () => {
    await startDb();
    app = getApp();
  });

  afterAll(async () => {
    await stopDb();
  });

  beforeEach(async () => {
    await syncDb(); // to force clean db before each test
  });

  test('should register a new user successfully', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
    };
    await request(app).post('/v1/register').send(userData).expect(200);

    const users = await User.findAll();

    expect(users.length).toBe(1);
    expect(users[0].getDataValue('email')).toEqual(userData.email);
  });

  test('should register a new user successfully with roles', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };
    await request(app).post('/v1/register').send(userData).expect(200);

    const users = await User.findAll({ include: Role });
    // const user = users[0];

    // const roles = await user.$get('roles');
    // expect(roles!.map((role: Role) => role.getDataValue('role'))).toEqual(
    //   userData.roles
    // );

    expect(users[0].roles.map((role) => role.getDataValue('role'))).toEqual(
      userData.roles
    );

    expect(users.length).toBe(1);
    expect(users[0].getDataValue('email')).toEqual(userData.email);
  });

  test('should not create a new user if it already exists', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };

    await request(app).post('/v1/register').send(userData).expect(200);
    const response = await request(app).post('/v1/register').send(userData);

    expect(response.body).toEqual({
      success: false,
      message: 'User already exists',
    });
  });

  test('should create a new user with a valid access / refresh token', async () => {
    const userData = {
      email: 'test@test.com',
      password: 'test123',
      roles: ['admin', 'customer'],
    };

    const response = await request(app).post('/v1/register').send(userData);

    const {
      data: { accessToken, refreshToken },
    } = response.body;

    expect(verifyAccessToken(accessToken)).toBeTruthy();
    expect(verifyRefreshToken(refreshToken)).toBeTruthy();
  });
});
```

# 18. Adding Transactions

## 18.1 `cls-hooked` or `async_hooks`?

- It is possible to substitute `cls-hooked` with Node.js's core library `async_hooks` to achieve similar functionality.
- While `cls-hooked` provides a higher-level abstraction and convenience for managing contexts, `async_hooks` offers a lower-level API for working directly with asynchronous hooks in Node.js.

- `async_hooks` allows you to create hooks that are triggered at specific lifecycle events of asynchronous operations, such as when a new asynchronous resource is created or when an existing resource is destroyed.
- By using `async_hooks`, you can track and associate contextual data with asynchronous operations throughout their lifecycle.

Here's a simplified example of using `async_hooks` to track contextual data:

```js
const async_hooks = require('async_hooks');

// Create a Map to store context data
const contextMap = new Map();

// Create a hook that tracks context data
const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const currentContext = contextMap.get(triggerAsyncId);
    if (currentContext) {
      // Associate the context data with the new async resource
      contextMap.set(asyncId, currentContext);
    }
  },
  destroy(asyncId) {
    // Remove the context data when the async resource is destroyed
    contextMap.delete(asyncId);
  },
});

// Enable the async hook
asyncHook.enable();

// Run code within the context
function runWithContext(contextData, callback) {
  const asyncId = async_hooks.executionAsyncId();
  contextMap.set(asyncId, contextData);

  // Execute the callback within the context
  callback();

  contextMap.delete(asyncId);
}

// Example usage
runWithContext({ key: 'value' }, () => {
  // Access the context data within an asynchronous operation
  setTimeout(() => {
    const asyncId = async_hooks.executionAsyncId();
    const contextData = contextMap.get(asyncId);
    console.log(contextData); // Output: { key: 'value' }
  }, 1000);
});
```

- In the example above, `async_hooks` is used to create a hook that tracks context data. The `init` function is called when a new asynchronous resource is created, and it associates the context data with the new resource. The `destroy` function is called when an async resource is destroyed, and it removes the associated context data.

- While `async_hooks` provides the foundation for managing contexts, it requires more manual bookkeeping and customization compared to `cls`-hooked, which offers a higher-level interface for working with contexts.

## 18.2 Sequelize's Transactions and `async_hooks`

- `async_hooks` can be used to manage Sequelize transactions by associating the transaction context with asynchronous operations.

- This allows you to automatically propagate the transaction context across async boundaries without explicitly passing it around.

```ts
import async_hooks from 'async_hooks';
import { Sequelize, Transaction } from 'sequelize';

// Create a Sequelize instance
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Create a Map to store transaction contexts
const transactionMap = new Map<number, Transaction>();

// Create a hook that tracks transaction contexts
const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const currentTransaction = transactionMap.get(triggerAsyncId);
    if (currentTransaction) {
      // Associate the transaction context with the new async resource
      transactionMap.set(asyncId, currentTransaction);
    }
  },
  destroy(asyncId) {
    // Remove the transaction context when the async resource is destroyed
    transactionMap.delete(asyncId);
  },
});

// Enable the async hook
asyncHook.enable();

// Run code within a transaction
async function runInTransaction(
  callback: (transaction: Transaction) => Promise<void>
): Promise<void> {
  const asyncId = async_hooks.executionAsyncId();

  // Start a Sequelize transaction
  const transaction = await sequelize.transaction();

  // Associate the transaction with the current async resource
  transactionMap.set(asyncId, transaction);

  try {
    // Execute the callback within the transaction
    await callback(transaction);

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    throw error;
  } finally {
    // Remove the transaction context
    transactionMap.delete(asyncId);
  }
}

// Example usage
runInTransaction(async (transaction) => {
  // Access the transaction within asynchronous operations
  await sequelize.models.User.create({ name: 'John Doe' }, { transaction });

  setTimeout(async () => {
    const asyncId = async_hooks.executionAsyncId();
    const transaction = transactionMap.get(asyncId);
    const users = await sequelize.models.User.findAll({ transaction });
    console.log(users);
  }, 1000);
});
```

## 18.3 Adding Transactions:

- enable CLS in `Database` class

```ts
import { Sequelize } from 'sequelize-typescript';
import cls from 'cls-hooked';

import { dbType } from '../config/database';
import { registerModels } from '../models';

export class Database {
  // ... rest of the class

  async connect() {
    // enable CLS
    const namespace = cls.createNamespace('sequelize-transactions');
    Sequelize.useCLS(namespace);

    // ...
  }
  // other methods
}
```

- now, in `register` controller:

```ts
import { Request, Response, Router } from 'express';
import { User, Role, UserRole, RefreshToken } from '../../models';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt-utils';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

// sign up
router.post(
  '/register',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password, roles } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(200).json({
        success: false,
        message: 'User already exists',
      });
    }

    const transaction = await User.sequelize!.transaction();

    try {
      const newUser = await User.create({ email, password } as any, {
        transaction,
      });
      const jwtPayload = {
        email: newUser.getDataValue('email'),
        password: newUser.getDataValue('password'),
      };
      const accessToken = generateAccessToken(jwtPayload);
      const refreshToken = generateRefreshToken(jwtPayload);
      await RefreshToken.create(
        {
          token: refreshToken,
          userId: newUser.id,
        } as any,
        { transaction }
      );

      if (roles && Array.isArray(roles)) {
        const rolesToSave = [];

        for (const role of roles) {
          const newRole = await Role.create({ role } as any, { transaction });
          await newUser.$add('role', newRole, { transaction });
        }
      }
      await transaction.commit();

      return res.json({
        success: true,
        message: 'User successfully registered',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      const error = err as Error;
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
```

- check if tests are still passing

# 19 Adding Login Controller

## 19.1 `login.controller`:

```ts
import { Router, Request, Response } from 'express';

import { User, RefreshToken } from '../../models';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../../utils/jwt-utils';
import { runAsyncWrapper } from '../../utils/runAsyncWrapper';

const router = Router();

router.post(
  '/login',
  runAsyncWrapper(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (
      !user ||
      !(await User.comparePasswords(password, user.getDataValue('password')))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const payload = { email };
    const accessToken = generateAccessToken(payload);
    const savedRefreshToken = await user.$get('refreshToken');

    let refreshToken;

    if (!savedRefreshToken || !savedRefreshToken.getDataValue('token')) {
      refreshToken = generateRefreshToken(payload);

      if (!savedRefreshToken) {
        await RefreshToken.create({
          token: refreshToken,
          userId: user.id,
        } as any);
      } else {
        await user.$add('refreshToken', refreshToken); // not quite sure
      }
    } else {
      refreshToken = savedRefreshToken.getDataValue('token');
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: {
        accessToken,
        refreshToken,
      },
    });
  })
);

export default router;
```

## 19.2 Testing `login.controller`:
