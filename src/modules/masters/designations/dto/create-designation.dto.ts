
import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

import { Transform, Type, type TransformFnParams } from 'class-transformer';

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class CreateDesignationDto {
  @ApiProperty({
    description: 'Designation name',
    example: 'Software Engineer',
    maxLength: 100,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  designationName: string;

  @ApiProperty({
    description: 'Department ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Department ID must be a positive number' })
  @Min(1, { message: 'Department ID must be a positive number' })
  departmentId: number;

  @ApiProperty({
    description: 'Designation level ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Designation level ID must be a positive number' })
  @Min(1, { message: 'Designation level ID must be a positive number' })
  levelId: number;
}
