
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

import { Transform, Type, type TransformFnParams } from 'class-transformer';

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  company_id: number;

  @ApiProperty({
    description: 'Department name',
    example: 'Information Technology',
    maxLength: 100,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department_name: string;

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
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
