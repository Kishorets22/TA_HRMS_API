import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../../common/dto/pagination-query.dto.js';

export class OrganizationQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by organization status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'status must be ACTIVE or INACTIVE',
  })
  status?: 'ACTIVE' | 'INACTIVE';
}