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
    allowNull: true,
  })
  declare token?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;
}

export default RefreshToken;
