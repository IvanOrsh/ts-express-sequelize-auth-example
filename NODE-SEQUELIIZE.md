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

# 2. Development Setup

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

# 3. Installing Dependencies:

`npm i express dotenv morgan bcrypt jsonwebtoken sequelize sequelize-typescript pg pg-hstore cls-hooked`

`npm i -D @types/morgan @types/pg @types/cls-hooked @types/bcrypt @types/validator` ...more types if needed

tsconfig:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true /* Enable experimental support for TC39 stage 2 draft decorators. */,
    "emitDecoratorMetadata": true /* Emit design-type metadata for decorated declarations in source files. */
  }
}
```

# 4. Using `docker compose` to Create Databases

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
      - .env.test
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
    ports:
      - ${DB_PORT:-5433}:5432
```

- `docker compose up -d`

- to enter the container: `docker exec -it node-ts-sequelize-auth-example-db bash`
