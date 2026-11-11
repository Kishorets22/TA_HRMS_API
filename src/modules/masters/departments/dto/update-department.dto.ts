import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { trim } from './create-department.dto.js';

// All fields optional for PATCH; company_id is not editable,
// so a department cannot be moved to another company.
export class UpdateDepartmentDto {
  @ApiPropertyOptional({
    description: 'Department name',
    example: 'Information Technology',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department_name?: string;

  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Handles software development and IT operations',
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Department active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
