
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

export class DepartmentQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter departments by company ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  company_id?: number;
}
