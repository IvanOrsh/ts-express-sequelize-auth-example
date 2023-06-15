import { Sequelize } from 'sequelize-typescript';

function registerModels(sequelize: Sequelize): void {
  sequelize.addModels([__dirname + '/**/*.model.*']);
}

export { registerModels };
