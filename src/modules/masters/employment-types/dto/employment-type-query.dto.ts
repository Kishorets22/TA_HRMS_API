
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, type TransformFnParams } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

// Query strings arrive as text; turn "true"/"false" into booleans
const toBoolean = ({ value }: TransformFnParams): boolean | string => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export class EmploymentTypeQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;
}
