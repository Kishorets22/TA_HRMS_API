import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

export class CompanyQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by company status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'status must be ACTIVE or INACTIVE',
  })
  status?: 'ACTIVE' | 'INACTIVE';

  @ApiPropertyOptional({
    description: 'Filter by organization ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'organizationId must be a positive number' })
  @Min(1, { message: 'organizationId must be a positive number' })
  organizationId?: number;
}
