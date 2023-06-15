import { Sequelize } from 'sequelize-typescript';

function registerModels(sequelize: Sequelize) {
  sequelize.addModels([__dirname + '/**/*.model.*']);
}

export { registerModels };
