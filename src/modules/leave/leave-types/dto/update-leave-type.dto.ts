import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

import type { LeaveUnit } from '../entities/leave-type.entity.js';

export class UpdateLeaveTypeDto {
  // --------------------------------------------------
  // Leave Type Details
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: 'CASUAL',
    description: 'Unique code for the leave type',
    maxLength: 30,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'Code can contain only uppercase letters, numbers, underscores and hyphens',
  })
  code?: string;

  @ApiPropertyOptional({
    example: 'Casual Leave',
    description: 'Name of the leave type',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 'DAYS',
    enum: ['DAYS', 'HOURS'],
  })
  @IsOptional()
  @IsEnum(['DAYS', 'HOURS'])
  unit?: LeaveUnit;

  // --------------------------------------------------
  // Leave Type Configuration
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: false,
    description: 'Indicates whether this is a compensatory leave type',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isCompensatory?: boolean;

  @ApiPropertyOptional({
    example: 5.0,
    description: 'Maximum carry-forward days allowed',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(9999.99)
  maxCarryForwardDays?: number;
}