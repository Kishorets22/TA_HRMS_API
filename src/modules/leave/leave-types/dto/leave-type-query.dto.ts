import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

import type { LeaveUnit } from '../entities/leave-type.entity.js';

export class LeaveTypeQueryDto {
  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Number of records per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: 'Casual',
    description: 'Search by leave type code or name',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  search?: string;

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'DAYS',
    enum: ['DAYS', 'HOURS'],
    description: 'Filter by leave calculation unit',
  })
  @IsOptional()
  @IsEnum(['DAYS', 'HOURS'])
  unit?: LeaveUnit;

  @ApiPropertyOptional({
    example: false,
    description: 'Filter by compensatory leave type',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isCompensatory?: boolean;

  // --------------------------------------------------
  // Sorting
  // --------------------------------------------------

  @ApiPropertyOptional({
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'name', 'code'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'name', 'code'])
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'code' = 'createdAt';

  @ApiPropertyOptional({
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}