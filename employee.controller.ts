import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { Roles } from 'src/services/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/services/auth/guard/jwt.guard';
import { RolesGuard } from 'src/services/auth/guard/roles.guard';
import { ModuleName, Role } from 'src/utils/constants/roles';
import { DeleteEmployeeDto } from './dto/deleteEmployee.dto';
import { ListOfEmployeeDto } from './dto/listOfEmployee.dto';
import { StatusRO } from 'src/services/serviceLayer';
import { ListOfEmployeeBdeNameDto } from './dto/employeeBdeName.dto';
import { changeSeniorDto } from './dto/changeSenior.dto';
import { AssignCourses } from './dto/assignCourse.dto';
import { FilterOfEmployee } from './dto/filterOfEmployee.dto';
import { EmployeeDeleteDto } from './dto/employeeDelete.dto';

@ApiTags(ModuleName.EMPLOYEE)
@Controller('api')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Roles(Role.Admin, Role.HR)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin and Hr can delete employee with details.',
  })
  @Put('deleteEmployee/:employeeId')
  @ApiParam({ example: 1, name: 'employeeId', required: true })
  deleteEmployee(
    @Param('employeeId') employeeId: number,
    @Body() dto: EmployeeDeleteDto,
  ): Promise<StatusRO> {
    return this.employeeService.deleteEmployee(employeeId, dto);
  }

  @Roles(Role.Admin, Role.HR, Role.Bde, Role.Employee)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin and Hr can view employee Details.' })
  @Post('listOfEmployee')
  listOfEmployee(@Body() dto: ListOfEmployeeDto): Promise<StatusRO> {
    return this.employeeService.listOfEmployee(dto);
  }

  @Roles(Role.Admin, Role.HR, Role.Bde)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin and Hr can view employee Details.' })
  @Post('listOfEmployeeBdeName')
  listOfEmployeeBdeName(@Body() dto: ListOfEmployeeBdeNameDto): Promise<StatusRO> {
    return this.employeeService.employeeBDENames(dto);
  }

  @Roles(Role.Admin, Role.HR)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin and Hr can change senior of employee.' })
  @Post('changeSenior')
  changeSenior(@Body() dto: changeSeniorDto): Promise<StatusRO> {
    return this.employeeService.changeSenior(dto);
  }

  @Roles(Role.Admin, Role.HR)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Admin and Hr can delete employee.',
  })
  @Put('employeeDelete/:employeeId')
  @ApiParam({ example: 1, name: 'employeeId', required: true })
  employeeDelete(
    @Param('employeeId') employeeId: number,
    @Body() dto: DeleteEmployeeDto,
  ): Promise<StatusRO> {
    return this.employeeService.employeeDelete(employeeId, dto);
  }

  @Roles(Role.Admin, Role.HR, Role.Bde)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin and Hr can view employee Details.' })
  @Post('listOfAssignCourses')
  listOfAssignCourse(@Body() dto: AssignCourses): Promise<StatusRO> {
    return this.employeeService.listOfAssignCourse(dto);
  }

  @Roles(Role.Admin, Role.HR, Role.Bde)
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('filterOfEmployee')
  filter(@Body() dto: FilterOfEmployee): Promise<StatusRO> {
    return this.employeeService.filterOfEmployee(dto);
  }
}