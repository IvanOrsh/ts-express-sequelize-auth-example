import { hash, compare } from 'bcrypt';
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeSave,
  Index,
  BeforeCreate,
} from 'sequelize-typescript';

import { environment } from '../config/environment';

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
}

export default User;
