import moment = require('moment');
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddEmployeeDto } from './dto/addEmployee.dto';
import { HandleResponse } from '../services/handleResponse';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from './dto/adminLogin.dto';
import { JwtService } from '@nestjs/jwt';
import { Messages } from 'src/utils/constants/message';
import { ReportTo } from 'src/models/reportTo.model';
import { CasualLeave } from 'src/models/casualLeave.model';
import { AuthUser } from 'src/models/authUser.model';
import { StatusRO } from 'src/services/serviceLayer';
import { DbService } from 'src/services/dbService';
import {
  AuthUserModel,
  CasualLeaveModel,
  ReportToModel,
} from 'src/services/modelInterface';
import { VerifyEmailDto } from './dto/verifyEmail.dto.model';
import { emailSend } from 'src/services/mail';
import { VerifyOtpDto } from './dto/verifyOtpDto.dto';
import { EditEmployeeDto } from './dto/editEmployee.dto';
import { Technology } from 'src/models/technology.model';
import { Role } from 'src/utils/constants/roles';
import { Otp } from 'src/models/otp.model';
import { ForgotPasswordDto } from './dto/forgotPsaaword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
const salt = 10;

@Injectable()
export class AdminProfileService {
  constructor(
    @InjectModel(AuthUser) private authUserModel: typeof AuthUser,
    @InjectModel(ReportTo) private reportToModel: typeof ReportTo,
    @InjectModel(CasualLeave) private casualLeaveModel: typeof CasualLeave,
    @InjectModel(Otp) private otpModel: typeof Otp,
    @InjectModel(Technology) private technologyModel: typeof Technology,
    private jwt: JwtService,
    private dbService: DbService,
  ) {}

  async addEmployee(dto: AddEmployeeDto): Promise<StatusRO> {
    try {
      let { technologyId, role, email } = dto;

      const findUser = await this.dbService.findOne(this.authUserModel, {
        email,
      });

      if (!findUser) {
        dto.password = await bcrypt.hash(dto.password, salt);
        let techDetails: any;

        if (role !== Role.Employee) {
          techDetails = await this.dbService.findOne(this.technologyModel, {
            techName: role,
          });
          technologyId = techDetails.dataValues.id;
        }

        const employee: AuthUserModel = await this.dbService.create(
          this.authUserModel,
          {
            ...dto,
            technologyId,
          },
        );

        if (employee) {
          let addedReportTo: ReportToModel = null;

          if (dto.reportTo) {
            addedReportTo = await this.dbService.create(this.reportToModel, {
              assignerId: dto.reportTo,
              assigneeId: employee.id,
            });
          }

          const employeeLeave: CasualLeaveModel = await this.dbService.create(
            this.casualLeaveModel,
            {
              addedBy: dto.userId,
              assignTo: employee.id,
              remainLeave: dto.remainLeave,
            },
          );

          if (addedReportTo || employeeLeave) {
            Logger.log(`${dto.role} ${Messages.ADD_SUCCESS}`);
            return HandleResponse(
              HttpStatus.OK,
              `${dto.role} ${Messages.ADD_SUCCESS}`,
              { id: employee.id },
              undefined,
            );
          }
        }
      } else {
        Logger.log(Messages.EMAIL_ALREADY_EXIST);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.EMAIL_ALREADY_EXIST,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      Logger.error(`${Messages.FAILED_TO} add ${dto.role}.`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} add ${dto.role}.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async login(dto: AdminLoginDto): Promise<StatusRO> {
    try {
      const { email }: { email: string } = dto;

      const employeeHrAdminLogin: AuthUserModel = await this.dbService.findOne(
        this.authUserModel,
        { email },
      );

      if (employeeHrAdminLogin) {
        if (employeeHrAdminLogin?.isDeleted === true) {
          Logger.error(Messages.IN_ACTIVE);
          return HandleResponse(
            HttpStatus.NOT_FOUND,
            Messages.IN_ACTIVE,
            undefined,
            undefined,
          );
        }
        const comparison: boolean = await bcrypt.compare(
          dto.password,
          employeeHrAdminLogin.password,
        );

        const id: string = employeeHrAdminLogin.id;
        const role: string = employeeHrAdminLogin.role;

        if (comparison) {
          let date = new Date();
          await this.dbService.update(
            this.authUserModel,
            { lastLogin: date },
            { id },
          );
          const token: string = await this.jwt.signAsync({
            id,
            role,
          });
          Logger.log(`${role} ${Messages.LOGIN_SUCCESS}.`);
          return HandleResponse(
            HttpStatus.OK,
            `${role} ${Messages.LOGIN_SUCCESS}.`,
            { id, token },
            undefined,
          );
        } else {
          Logger.error(`Password ${Messages.DOES_NOT_MATCH}.`);
          return HandleResponse(
            HttpStatus.BAD_REQUEST,
            `Password ${Messages.DOES_NOT_MATCH}.`,
            undefined,
            undefined,
          );
        }
      } else {
        Logger.error(`This email ${Messages.DOES_NOT_EXIST}.`);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          `This email ${Messages.DOES_NOT_EXIST}.`,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      Logger.error(`${Messages.FAILED_TO} login.`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} login.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async verifyEmail(dto: VerifyEmailDto) {
    try {
      const generateOtp = Math.floor(1000 + Math.random() * 9000);
      const { email } = dto;
      const userEmail: any = await this.authUserModel.findOne({
        where: {
          email,
          isDeleted: false,
        },
      });
      const fullName = `${userEmail.dataValues.firstName} ${userEmail.dataValues.lastName}`;

      if (userEmail) {
        const expireDate: any = moment().add(10, 'minutes').format();
        let otpData = {
          otp: generateOtp,
          expiration_time: expireDate,
          email,
          fullName,
        };

        emailSend(otpData);
        const createOtp: any = await this.otpModel.create(otpData);

        if (createOtp) {
          Logger.log(`${Messages.EMAIL_VERIFY} successfully.`);
          return HandleResponse(
            HttpStatus.OK,
            Messages.EMAIL_SENT,
            { otp: otpData.otp },
            undefined,
          );
        }
      } else {
        Logger.error(Messages.EMAIL_INCORRECT);
        return HandleResponse(
          HttpStatus.BAD_REQUEST,
          Messages.EMAIL_INCORRECT,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      Logger.error(`${Messages.FAILED_TO} find user email.`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} find user email.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const { email, otp } = dto;

      const findOtp: any = await this.dbService.findOne(this.otpModel, {
        email,
        otp,
      });

      if (findOtp && Object.keys(findOtp).length > 0) {
        const currentTime = new Date();
        const expirationTime = new Date(findOtp.expiration_time);
        if (expirationTime < currentTime) {
          Logger.log(Messages.OTP_EXPIRED);
          return HandleResponse(
            HttpStatus.BAD_REQUEST,
            Messages.OTP_EXPIRED,
            undefined,
            undefined,
          );
        } else {
          const destroyOtpData: any = await this.dbService.destroy(
            this.otpModel,
            {
              otp: findOtp.otp,
              email: findOtp.email,
            },
          );

          if (destroyOtpData === 1) {
            Logger.log(Messages.OTP_VERIFIED);
            return HandleResponse(
              HttpStatus.OK,
              Messages.OTP_VERIFIED,
              undefined,
              undefined,
            );
          }
        }
      } else {
        const findEmail: any = await this.dbService.findOne(this.otpModel, {
          email,
        });

        if (findEmail && Object.keys(findEmail).length > 0) {
          Logger.log(Messages.OTP_NOT_MATCHED);
          return HandleResponse(
            HttpStatus.BAD_REQUEST,
            Messages.OTP_NOT_MATCHED,
            undefined,
            undefined,
          );
        } else {
          Logger.log(Messages.EMAIL_NOT_FOUND);
          return HandleResponse(
            HttpStatus.NOT_FOUND,
            Messages.EMAIL_NOT_FOUND,
            undefined,
            undefined,
          );
        }
      }
    } catch (error) {
      Logger.error(`${Messages.FAILED_TO} verify otp`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} verify otp`,
        undefined,
        undefined,
      );
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const { email, newPassword } = dto;

      const existingUser: AuthUser = await this.dbService.findOne(
        this.authUserModel,
        { email },
      );

      if (!existingUser) {
        Logger.error(Messages.EMAIL_INCORRECT);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.EMAIL_INCORRECT,
          undefined,
          undefined,
        );
      }

      const saltRounds: number = 10;
      const bcryptPassword: any = await bcrypt.hash(newPassword, saltRounds);

      const [updatePassword] = await this.dbService.update(
        this.authUserModel,
        { password: bcryptPassword },
        { id: existingUser.id },
      );

      if (updatePassword === 1) {
        Logger.log(`Your password ${Messages.UPDATE_SUCCESS}`);
        return HandleResponse(
          HttpStatus.ACCEPTED,
          `Your password ${Messages.UPDATE_SUCCESS}`,
          undefined,
          undefined,
        );
      } else {
        Logger.error(Messages.UPDATE_FAILED);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.UPDATE_FAILED,
          undefined,
          undefined,
        );
      }
    } catch (error) {
      Logger.error(error);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} update password.`,
        undefined,
        undefined,
      );
    }
  }

  async editEmployee(id: number, dto: EditEmployeeDto): Promise<StatusRO> {
    try {
      const [updatedUser]: number[] = await this.dbService.update(
        this.authUserModel,
        { ...dto.user },
        { id },
      );

      const [updatedLeave]: number[] = await this.dbService.update(
        this.casualLeaveModel,
        { ...dto.leave },
        { assignTo: id },
      );

      if (updatedLeave === 1 || updatedUser === 1) {
        Logger.log(`Profile ${Messages.UPDATE_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          `Profile ${Messages.UPDATE_SUCCESS}`,
          undefined,
          undefined,
        );
      } else {
        Logger.error(Messages.ID_NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.ID_NOT_FOUND,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      Logger.error(`${Messages.FAILED_TO} update profile.`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} update profile.`,
        undefined,
        {
          errorMessage: error.message,
          field: error.fields,
        },
      );
    }
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    try {
      const existingUser: AuthUser = await this.dbService.findOne(
        this.authUserModel,
        { id },
      );

      if (existingUser && Object.keys(existingUser).length > 0) {
        const validPassword: any = await bcrypt.compare(
          dto.currentPassword,
          existingUser.password,
        );

        if (validPassword) {
          if (dto.currentPassword === dto.newPassword) {
            Logger.error(Messages.SAME_PASSWORDS);
            return HandleResponse(
              HttpStatus.BAD_REQUEST,
              Messages.SAME_PASSWORDS,
              undefined,
              undefined,
            );
          }

          const saltRounds = 10;
          const bcryptPassword: any = await bcrypt.hash(
            dto.newPassword,
            saltRounds,
          );

          const [updatedPassword] = await this.dbService.update(
            this.authUserModel,
            { password: bcryptPassword },
            { id: existingUser.id },
          );

          if (updatedPassword === 1) {
            Logger.log(`Your password ${Messages.UPDATE_SUCCESS}`);
            return HandleResponse(
              HttpStatus.ACCEPTED,
              `Your password ${Messages.UPDATE_SUCCESS}`,
              undefined,
              undefined,
            );
          } else {
            Logger.error(`Your password is ${Messages.UPDATE_FAILED}`);
            return HandleResponse(
              HttpStatus.BAD_REQUEST,
              `Your password is ${Messages.UPDATE_FAILED}`,
              undefined,
              undefined,
            );
          }
        } else {
          Logger.error(Messages.INCORRECT_PASSWORD);
          return HandleResponse(
            HttpStatus.NOT_ACCEPTABLE,
            Messages.INCORRECT_PASSWORD,
            undefined,
            undefined,
          );
        }
      } else {
        Logger.error(Messages.EMAIL_INCORRECT);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.EMAIL_INCORRECT,
          undefined,
          undefined,
        );
      }
    } catch (error) {
      Logger.error(`${Messages.FAILED_TO} reset password.`);
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} reset password.`,
        undefined,
        {
          errorMessage: error.message,
          field: error.fields,
        },
      );
    }
  }
}
