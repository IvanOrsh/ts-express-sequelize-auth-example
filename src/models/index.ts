import fs from 'fs';
import path from 'path';

import { Sequelize } from 'sequelize-typescript';

let models: { [key: string]: any } = {
  //   User: User,
  //   RefreshToken: RefreshToken,
  //   Role: Role,
  //   sequelize: sequelize,
};

function registerModels(sequelize: Sequelize) {
  const thisFile = path.basename(__filename); // index.ts
  const modelFiles = fs.readdirSync(__dirname);
  const filterModelFiles = modelFiles.filter(
    (file) => (file !== thisFile && file.slice(-3) === '.js') || '.ts'
  );

  for (const file of filterModelFiles) {
    const model = require(path.join(__dirname, file)).default(sequelize);
    models[model.name as string] = model;
  }

  // Register associations of the models

  models.sequelize = sequelize;
}

export { registerModels, models };
