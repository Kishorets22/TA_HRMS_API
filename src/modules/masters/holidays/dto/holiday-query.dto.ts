
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  Matches,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

export class HolidayQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter holidays by company ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  companyId?: number;

  @ApiPropertyOptional({
    example: '2026-01-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2026-12-31',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  toDate?: string;
}
