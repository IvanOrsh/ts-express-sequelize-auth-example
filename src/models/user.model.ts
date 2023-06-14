import { hash, compare } from 'bcrypt';
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeSave,
  Index,
  BeforeCreate,
  HasMany,
  Scopes,
  BelongsToMany,
} from 'sequelize-typescript';

import { environment } from '../config/environment';
import Role from './role.model';
import UserRole from './userRole.model';

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

  @BelongsToMany(() => Role, () => UserRole)
  roles!: Role[];

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

  static async createWithDefaultRole(userData: any): Promise<User> {
    const user = await User.create(userData);
    const defaultRole = await Role.findOne({ where: { role: 'Guest' } }); // Assuming 'Default' is the name of the default role
    if (defaultRole) {
      await user.$add('role', defaultRole); // Assign the default role to the user
    }
    return user;
  }
}

export default User;