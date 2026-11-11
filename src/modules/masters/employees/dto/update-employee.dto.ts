
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
  IsBoolean,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeDto {
  // Company Information
  @ApiPropertyOptional({ example: '1', description: 'Company ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  companyId?: string;

  // Employee Information
  @ApiPropertyOptional({ example: 'EMP1001' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  employeeId?: string;

  @ApiPropertyOptional({ example: 'Arun' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Kumar' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ example: '2000-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  gender?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/profiles/arun.jpg',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  profilePhotoUrl?: string;

  // Contact Information
  @ApiPropertyOptional({ example: 'arun.kumar@company.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  workEmail?: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'arun.personal@gmail.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  personalEmail?: string;

  @ApiPropertyOptional({
    example: 'Chennai, Tamil Nadu, India',
  })
  @IsOptional()
  @IsString()
  currentAddress?: string;

  @ApiPropertyOptional({
    example: 'Coimbatore, Tamil Nadu, India',
  })
  @IsOptional()
  @IsString()
  permanentAddress?: string;

  // Emergency Contact
  @ApiPropertyOptional({ example: 'Ramesh Kumar' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  emergencyContactName?: string;

  @ApiPropertyOptional({ example: '9876501234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  emergencyContactPhone?: string;

  // Employment Information
  @ApiPropertyOptional({ example: '2026-11-10' })
  @IsOptional()
  @IsDateString()
  dateOfJoining?: string;

  @ApiPropertyOptional({ example: '1', description: 'Department ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  departmentId?: string;

  @ApiPropertyOptional({ example: '1', description: 'Designation ID' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  designationId?: string;

  @ApiPropertyOptional({ example: '1', description: 'Branch ID' })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({
    example: '6',
    description: 'Reporting manager employee database ID',
  })
  @IsOptional()
  @IsString()
  reportingManagerId?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Employment Type ID',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employmentTypeId?: string;

  // Employment Status
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  employeeStatus?: boolean;

  @ApiPropertyOptional({ example: '2027-02-10' })
  @IsOptional()
  @IsDateString()
  probationEndDate?: string;

  @ApiPropertyOptional({ example: '2028-11-10' })
  @IsOptional()
  @IsDateString()
  dateOfExit?: string;
}
