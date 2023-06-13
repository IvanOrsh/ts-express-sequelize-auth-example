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
