import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

import { EMPLOYMENT_TYPE_LIMITS } from '../constants/employment-type.constants.js';
import { normalizeName, trim } from './create-employment-type.dto.js';

// All fields optional for PATCH
export class UpdateEmploymentTypeDto {
  @ApiPropertyOptional({
    description: 'Updated employment type name',
    example: 'Permanent',
    maxLength: EMPLOYMENT_TYPE_LIMITS.NAME_MAX_LENGTH,
  })
  @IsOptional()
  @Transform(normalizeName)
  @IsString()
  @IsNotEmpty()
  @MaxLength(EMPLOYMENT_TYPE_LIMITS.NAME_MAX_LENGTH)
  employmentTypeName?: string;

  @ApiPropertyOptional({
    description: 'Updated employment type description',
    example: 'Full-time permanent employment',
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Set to true to reactivate a deactivated employment type',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
