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
