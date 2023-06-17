# Migrations

1. install sequelize-cli: `npm i sequelize-cli`
2. configure sequelize-cli:

```js
const path = require('path');

module.exports = {
  'config': path.resolve('db', 'config.json'),
  'models-path': path.resolve('build', 'models'),
  'migrations-path': path.resolve('db', 'migrations'),
  'seeders-path': path.resolve('db', 'seeders'),
};
```

config can look like this:

```json
{
  "development": {
    "username": "postgres",
    "password": "postgres",
    "database": "postgres",
    "port": 5432,
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "postgres",
    "password": "postgres",
    "database": "postgres",
    "port": 5433,
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

# Adding migration for users table

`npx sequelize-cli migration:generate --name create_users_table`

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Users',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          email: {
            allowNull: false,
            type: Sequelize.STRING(100),
            unique: true,
          },
          password: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          username: {
            type: Data
          }
          firstName: {
            allowNull: true,
            type: Sequelize.STRING(50),
          },
          lastName: {
            allowNull: true,
            type: Sequelize.STRING(50),
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
      await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Users');
  },
};
```

apply migration: `npx sequelize-cli db:migrate`

(`npx sequelize-cli db:migrate --env test`, to migrate test db, just in case)

`npx sequelize-cli db:migrate:undo:all` to undo all (duh)

# Adding migration for roles table

`npx sequelize-cli migration:generate --name create_roles_table`

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'Roles',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          role: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
      await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Roles');
  },
};
```

# Adding migration for users_roles table

`npx sequelize-cli migration:generate --name create_user_roles_table`

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'UserRoles',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
              model: 'Users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          roleId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
              model: 'Roles',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('UserRoles');
  },
};
```

# Adding migration for refresh_token_table

`npx sequelize-cli migration:generate --name create_refresh_tokens_table`

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'RefreshTokens',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          token: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
              model: 'Users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('RefreshTokens');
  },
};
```
