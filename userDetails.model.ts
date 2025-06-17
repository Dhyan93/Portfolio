import { MaxLength } from 'class-validator';
import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import {
  Gender,
  Nationality,
  Position,
  Religion,
} from 'src/utils/constants/roles';
import { AuthUser } from './authUser.model';
import { Technology } from './technology.model';

@Table({ tableName: 'UserDetails' })
export class UserDetails extends Model<UserDetails> {
  @ForeignKey(() => AuthUser)
  @AllowNull(false)
  @MaxLength(11)
  @Column
  userId: number;

  @AllowNull(true)
  @MaxLength(100)
  @Column
  profileImage: string;

  @Column({
    type: DataTypes.ENUM(
      Position.Boss,
      Position.Intern,
      Position.Junior_Developer,
      Position.Senior_Developer,
      Position.Team_Leader,
    ),
  })
  position: string;

  @AllowNull(true)
  @Column({ type: DataTypes.DATEONLY })
  dob: Date;

  @AllowNull(true)
  @Column({ type: DataTypes.ENUM(Gender.Male, Gender.Female, Gender.Other) })
  gender: string;

  @AllowNull(true)
  @Column
  skypeId: string;

  @AllowNull(true)
  @Unique
  @Column
  personalEmail: string;

  @AllowNull(true)
  @Column({ defaultValue: false })
  maritalStatus: boolean;

  @AllowNull(true)
  @Column({
    type: DataTypes.ENUM(
      Religion.Hindu,
      Religion.Christian,
      Religion.Jain,
      Religion.Muslim,
    ),
  })
  religion: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.ENUM(
      Nationality.Indian,
      Nationality.Australian,
      Nationality.Pakistani,
      Nationality.Canadian,
    ),
  })
  nationality: string;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({ type: 'TIMESTAMP' })
  createdAt: Date;

  @Default(Sequelize.literal('CURRENT_TIMESTAMP'))
  @Column({
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    ),
  })
  updatedAt: Date;

  @MaxLength(1)
  @Column({ defaultValue: false })
  isDeleted: boolean;

  @BelongsTo(() => AuthUser)
  authUser: AuthUser;
}
