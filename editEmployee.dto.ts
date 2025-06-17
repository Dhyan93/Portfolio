import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class UserDto {
  @ApiProperty({
    example: 'Kaushik',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Rathod',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'kaushikrathod@gmail.com',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '1234567890',
    type: 'string',
    format: 'string',
    required: false,
  })
  @IsString()
  @IsMobilePhone()
  @IsOptional()
  phoneNo: string;

  @ApiProperty({
    example: '2022-07-22',
    type: 'string',
    format: 'Date',
    required: false,
  })
  @IsString()
  @IsOptional()
  dateOfJoin: Date;

  @ApiProperty({ example: 1, type: 'number', format: 'number', required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  technologyId: number;
}

class LeaveDto {
  @ApiProperty({ example: 1, type: 'number', format: 'number', required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  remainLeave: number;
}

export class EditEmployeeDto {
  @ApiProperty({ type: UserDto, required: false })
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  @IsOptional()
  @IsObject()
  user: UserDto;

  @ApiProperty({ type: LeaveDto, required: false })
  @ValidateNested({ each: true })
  @Type(() => LeaveDto)
  @IsOptional()
  @IsObject()
  leave: LeaveDto;
}