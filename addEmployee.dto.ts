import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddEmployeeDto {
  @ApiProperty({ example: 1, type: 'number', format: 'number', required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 'Admin',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  addedBy: string;

  @ApiProperty({ example: 3, type: 'number', format: 'number', required: true })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  reportTo: number;

  @ApiProperty({ example: 1, type: 'number', format: 'number', required: false })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  technologyId: number;

  @ApiProperty({
    example: 'Kabushiki',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Rato',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'kaushikrathod@gmail.com',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Kabushiki@123',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '1234567890',
    type: 'string',
    format: 'string',
    required: true,
  })
  @IsString()
  @IsMobilePhone()
  @IsNotEmpty()
  phoneNo: string;

  @ApiProperty({ example: 'Employee', type: 'string', required: true })
  @IsEnum({
    HR: 'HR',
    Employee: 'Employee',
    BDE: 'BDE',
  })
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    example: '2021-11-08',
    type: 'string',
    format: 'Date',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  dateOfJoin: Date;

  @ApiProperty({ example: 1, type: 'number', format: 'number', required: true })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  remainLeave: number;
}
