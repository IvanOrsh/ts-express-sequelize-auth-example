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
