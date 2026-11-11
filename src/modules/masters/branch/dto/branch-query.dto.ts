import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

// Query strings arrive as text; turn "true"/"false" into booleans
const toBoolean = ({ value }: TransformFnParams): boolean | string => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class BranchQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filter branches by company ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  companyId?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter branches by active status',
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;
}
