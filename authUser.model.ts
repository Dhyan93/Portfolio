import { MaxLength } from 'class-validator';
import { DataTypes, Sequelize } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Role } from 'src/utils/constants/roles';
import { Address } from './address.model';
import { BankDetails } from './bankDetails.model';
import { EducationDetails } from './educationDetails.model';
import { EmergencyContact } from './emergencyContact.model';
import { ResourcesAssign } from './resourcesAssign.model';
import { UserDetails } from './userDetails.model';
import { CompOfLeave } from './compOfLeave.model';
import { TaskSheet } from './taskSheet.model';
import { ReportTo } from './reportTo.model';
import { Support } from './support.model';
import { TimeSheet } from './timeSheet.model';
import { Interview } from './interview.model';
import { UserCourse } from './userCourse.model';
import { Technology } from './technology.model';
import { ItpProjectsAssign } from './itpProjectsAssign.model';

@Table({ tableName: 'AuthUser' })
export class AuthUser extends Model<AuthUser> {
  @AllowNull(false)
  @MaxLength(150)
  @Column
  password: string;

  @AllowNull(false)
  @Unique
  @MaxLength(255)
  @Column
  email: string;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  firstName: string;

  @AllowNull(false)
  @MaxLength(50)
  @Column
  lastName: string;

  @AllowNull(false)
  @MaxLength(15)
  @Column
  phoneNo: string;

  @AllowNull(false)
  @Column({ type: DataTypes.ENUM(Role.Admin, Role.Employee, Role.HR, Role.Bde) })
  role: string;

  @AllowNull(false)
  @Column({ type: DataTypes.DATEONLY })
  dateOfJoin: Date;

  @AllowNull(true)
  @ForeignKey(() => Technology)
  @MaxLength(11)
  @Column
  technologyId: number;

  @MaxLength(1)
  @Column({ defaultValue: true })
  isActive: boolean;

  @Column({ type: 'TIMESTAMP' })
  lastLogin: Date;

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

  @HasOne(() => UserDetails, { foreignKey: 'userId' })
  userDetails: UserDetails;

  @HasOne(() => Address, { foreignKey: 'userId' })
  address: Address;

  @HasOne(() => BankDetails, { foreignKey: 'assignTo' })
  bankDetails: BankDetails;

  @HasMany(() => EducationDetails, { foreignKey: 'userId' })
  educationDetails: EducationDetails;

  @HasMany(() => EmergencyContact, { foreignKey: 'userId' })
  emergencyContact: EmergencyContact;

  @HasOne(() => ResourcesAssign, { foreignKey: 'assignTo' })
  resourcesAssign: ResourcesAssign;

  @HasMany(() => CompOfLeave, { foreignKey: 'userId' })
  compOfLeave: CompOfLeave;

  @HasMany(() => ReportTo, { foreignKey: 'assignerId' })
  reportTo: ReportTo;

  @HasMany(() => Support)
  support: Support[];

  @HasMany(() => TaskSheet, { foreignKey: 'assignTo' })
  taskSheet: TaskSheet;

  @HasMany(() => TimeSheet, { foreignKey: 'userId' })
  timeSheet: TimeSheet;

  @HasMany(() => Interview)
  interview: Interview;

  @HasMany(() => UserCourse)
  userCourse: UserCourse

  @HasMany(() => ItpProjectsAssign)
  itpProjectsAssign: ItpProjectsAssign;

  @BelongsTo(() => Technology)
  technology: Technology;
}