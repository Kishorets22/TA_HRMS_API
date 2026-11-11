
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { Transform, type TransformFnParams } from 'class-transformer';

import { EMPLOYMENT_TYPE_LIMITS } from '../constants/employment-type.constants.js';

// Trims and collapses repeated spaces ("  Full   Time " -> "Full Time")
export const normalizeName = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value;

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class CreateEmploymentTypeDto {
  @ApiProperty({
    example: 'Full Time',
    description: 'Name of the employment type',
    maxLength: EMPLOYMENT_TYPE_LIMITS.NAME_MAX_LENGTH,
  })
  @Transform(normalizeName)
  @IsString()
  @IsNotEmpty()
  @MaxLength(EMPLOYMENT_TYPE_LIMITS.NAME_MAX_LENGTH)
  employmentTypeName: string;

  @ApiPropertyOptional({
    example: 'Permanent full-time employment',
    description: 'Description of the employment type',
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the employment type is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
