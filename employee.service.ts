import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BankDetails } from 'src/models/bankDetails.model';
import { HandleResponse } from 'src/services/handleResponse';
import { Messages } from '../utils/constants/message';
import { EmergencyContact } from 'src/models/emergencyContact.model';
import { EducationDetails } from 'src/models/educationDetails.model';
import { DeleteEmployeeDto } from './dto/deleteEmployee.dto';
import { Documents } from 'src/models/documents.model';
import { ListOfEmployeeDto } from './dto/listOfEmployee.dto';
import { employeeFilter, StatusRO } from 'src/services/serviceLayer';
import { AuthUser } from 'src/models/authUser.model';
import { DbService } from 'src/services/dbService';
import { AuthUserModel, UserCourseModel } from 'src/services/modelInterface';
import { UserDetails } from 'src/models/userDetails.model';
import { ListOfEmployeeBdeNameDto } from './dto/employeeBdeName.dto';
import { Sequelize } from 'sequelize';
import { changeSeniorDto } from './dto/changeSenior.dto';
import { ReportTo } from 'src/models/reportTo.model';
import { emailSend } from 'src/services/mail';
import { UserCourse } from 'src/models/userCourse.model';
import { Course } from 'src/models/course.model';
import { AssignCourses } from './dto/assignCourse.dto';
import { Role } from 'src/utils/constants/roles';
import { FilterOfEmployee } from './dto/filterOfEmployee.dto';
import { Technology } from 'src/models/technology.model';
import { EmployeeDeleteDto } from './dto/employeeDelete.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(BankDetails) private bankDetailsModel: typeof BankDetails,
    @InjectModel(AuthUser) private authUserModel: typeof AuthUser,
    @InjectModel(UserDetails) private userDetailsModel: typeof UserDetails,
    @InjectModel(Documents) private documentsModel: typeof Documents,
    @InjectModel(EmergencyContact)
    private emergencyContact: typeof EmergencyContact,
    @InjectModel(EducationDetails)
    private educationDetails: typeof EducationDetails,
    @InjectModel(ReportTo) private reportToModel: typeof ReportTo,
    @InjectModel(UserCourse) private userCourseModel: typeof UserCourse,
    @InjectModel(Course) private courseModel: typeof Course,
    @InjectModel(Technology) private techModel: typeof Technology,
    private dbService: DbService,
  ) {}

  async deleteEmployee(
    employeeId: number,
    dto: EmployeeDeleteDto,
  ): Promise<StatusRO> {
    try {
      const [deleteEmployeeData]: number[] = await this.dbService.update(
        this.authUserModel,
        dto,
        { id: employeeId },
      )
      
      if (deleteEmployeeData) {
        const [deleteEmployeeBankData]: number[] = await this.dbService.update(
          this.bankDetailsModel,
          dto,
          {
            assignTo: employeeId,
          },
        );

        const [deleteEmployeeDocumentsData]: number[] =
          await this.dbService.update(this.documentsModel, dto, {
            userId: employeeId,
          });

        const [deleteEmployeeEmergencyContactData]: number[] =
          await this.dbService.update(this.emergencyContact, dto, {
            userId: employeeId,
          });

        const [deleteEmployeeEducationData]: number[] =
          await this.dbService.update(this.educationDetails, dto, {
            userId: employeeId,
          });
          
        if (
          deleteEmployeeData === 1 ||
          deleteEmployeeBankData === 1 ||
          deleteEmployeeDocumentsData === 1 ||
          deleteEmployeeEmergencyContactData === 1 ||
          deleteEmployeeEducationData === 1
        ) {
          Logger.log(`Employee ${Messages.DELETED_SUCCESS}`);
          return HandleResponse(
            HttpStatus.OK,
            `Employee ${Messages.DELETED_SUCCESS}`,
            undefined,
            undefined,
          );
        }
        else {
          Logger.log(Messages.NOT_FOUND);
          return HandleResponse(
            HttpStatus.NOT_FOUND,
            Messages.NOT_FOUND,
            undefined,
            undefined,
          );
        }
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.NOT_FOUND,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} delete employee.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async listOfEmployee(dto: ListOfEmployeeDto): Promise<StatusRO> {
    try {
      const findEmployeeInclude: any = [
        {
          model: this.userDetailsModel,
          attributes: ['id', 'profileImage'],
        },
        {
          model: this.techModel,
          attributes: ['id', 'techName']
        },
      ];

      const findEmployeeDetails: AuthUserModel = await this.dbService.findAll(
        this.authUserModel,
        undefined,
        {...dto, isDeleted: false},
        [['firstName', 'ASC']],
        findEmployeeInclude,
      );

      if (findEmployeeDetails && Object.keys(findEmployeeDetails).length > 0) {
        Logger.log(`Employee details ${Messages.GET_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          undefined,
          findEmployeeDetails,
          undefined,
        );
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          `Employee details ${Messages.NOT_FOUND}`,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} view employee details.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async employeeBDENames(dto: ListOfEmployeeBdeNameDto): Promise<StatusRO> {
    try {
      const { role } = dto;

      if ( role[0] === Role.Bde ) {
        dto.role.push(Role.Admin);
      }

      const findEmployeeDetails: AuthUserModel = await this.dbService.findAll(
        this.authUserModel,
        [
          'id',
          [
            Sequelize.fn(
              'concat',
              Sequelize.col('firstName'),
              ' ',
              Sequelize.col('lastName'),
            ),
            'developerName',
          ],
        ],
        dto,
        [['firstName', 'ASC']],
      );

      if (findEmployeeDetails && Object.keys(findEmployeeDetails).length > 0) {
        Logger.log(`Employee details ${Messages.GET_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          undefined,
          findEmployeeDetails,
          undefined,
        );
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          `Employee details ${Messages.NOT_FOUND}`,
          undefined,
          undefined,
        );
      }
    } catch (error) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} view employee details.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async changeSenior(dto: changeSeniorDto): Promise<StatusRO> {
    try {
      const { assignerId, assigneeId } = dto;

      const findSenior: any = await this.dbService.findOne(this.reportToModel, {
        assigneeId,
      });

      let newSeniorEntry: any ;
      if (!findSenior) {
        newSeniorEntry = await this.dbService.create(
          this.reportToModel,
          {
            assignerId,
            assigneeId,
          },
        );
      } else {
        await this.dbService.destroy(
          this.reportToModel,
          { assigneeId },
        );
        newSeniorEntry= await this.dbService.create(
          this.reportToModel,
          {
            assignerId,
            assigneeId,
          },
        );
      }

      if (newSeniorEntry && Object.keys(newSeniorEntry).length > 0) {
        const assignerUser = await this.dbService.findOne(
          this.authUserModel,
          {
            id: assignerId,
          },
        );

        const assigneeUser = await this.dbService.findOne(
          this.authUserModel,
          {
            id: assigneeId,
          },
        );

        if (assignerUser && assigneeUser) {
          const assignerEmail = assignerUser.email;
          const assignerMessage = `You are now the senior of ${assigneeUser.firstName}.`;
          emailSend({
            email: assignerEmail,
            emailMessage: assignerMessage,
          });

          const assigneeEmail = assigneeUser.email;
          const assigneeMessage = `You are now the junior of ${assignerUser.firstName}.`;
          emailSend({
            email: assigneeEmail,
            emailMessage: assigneeMessage,
          });
        }

        Logger.log(`Senior ${Messages.UPDATE_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          `Senior ${Messages.UPDATE_SUCCESS}`,
          undefined,
          undefined,
        );
      }
    } catch (error) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} change senior of employee.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async employeeDelete(
    employeeId: number,
    dto: DeleteEmployeeDto,
  ): Promise<StatusRO> {
    try {
      const [deleteEmployeeData]: number[] = await this.dbService.update(
        this.authUserModel,
        dto,
        { id: employeeId },
      );

      if (deleteEmployeeData) {
        const message = dto.isActive ? 'Employee is Active' : 'Employee is InActive';
        Logger.log(`Employee ${message}`);
        return HandleResponse(
          HttpStatus.OK,
          message,
          undefined,
          undefined,
        );
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.NOT_FOUND,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} delete employee.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async listOfAssignCourse(dto: AssignCourses): Promise<StatusRO> {
    try {
      const findCourseInclude: any = [
        {
          model: this.courseModel,
          attributes: ['id', 'courseName'],
        },
      ];

      const findEmployeeDetails: UserCourseModel[] = await this.dbService.findAll(
        this.userCourseModel,
        ['id','assignTo'],
        dto,
        undefined,
        findCourseInclude,
      );
      
      if (findEmployeeDetails && findEmployeeDetails.length > 0) {
        Logger.log(`Employee details ${Messages.GET_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          undefined,
          findEmployeeDetails,
          undefined,
        );
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          `Employee details ${Messages.NOT_FOUND}`,
          undefined,
          undefined,
        );
      }
    } catch (error: any) {
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} view employee details.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }

  async filterOfEmployee(dto: FilterOfEmployee): Promise<StatusRO> {
    try {
     const filteredData: any = employeeFilter(dto);

      const findEmployeeInclude: any = [
        {
          model: this.userDetailsModel,
          attributes: ['id', 'profileImage'],
        },
        {
          model: this.techModel,
          attributes: ['id', 'techName'],
          where: {...filteredData.value}
        },
      ];

      const findEmployeeDetails: AuthUserModel[] = await this.dbService.findAll(
        this.authUserModel,
        {
          exclude: [
            'createdAt',
            'updatedAt',
            'password',
          ]
        },
        {...filteredData.result},
        [['firstName', 'ASC']],
        findEmployeeInclude,
      );
      
      if (findEmployeeDetails && findEmployeeDetails?.length > 0) {
        findEmployeeDetails.forEach((item: any, index) => {
          if (item.role === Role.Employee && item.technology === null) {
            findEmployeeDetails.splice(index, 1);
          }
        });

        Logger.log(`Employee details ${Messages.GET_SUCCESS}`);
        return HandleResponse(
          HttpStatus.OK,
          undefined,
          findEmployeeDetails,
          undefined,
        );
      } else {
        Logger.log(Messages.NOT_FOUND);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          Messages.NOT_FOUND,
          [],
          undefined,
        );
      }
    } catch (error: any) {      
      return HandleResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `${Messages.FAILED_TO} view employee details.`,
        undefined,
        {
          errorMessage: error.original.sqlMessage,
          field: error.fields,
        },
      );
    }
  }
}
