
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { Transform, Type, type TransformFnParams } from 'class-transformer';

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class UpdateDesignationDto {
  @ApiPropertyOptional({
    description: 'Designation name',
    example: 'Software Engineer',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  designationName?: string;

  @ApiPropertyOptional({
    description: 'Department ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Department ID must be a positive number' })
  @Min(1, { message: 'Department ID must be a positive number' })
  departmentId?: number;

  @ApiPropertyOptional({
    description: 'Designation level ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Designation level ID must be a positive number' })
  @Min(1, { message: 'Designation level ID must be a positive number' })
  levelId?: number;
}
