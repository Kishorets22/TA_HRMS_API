
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

export class EmploymentTypeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Full Time' })
  employmentTypeName: string;

  @ApiPropertyOptional({ example: 'Permanent full-time employment' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-11-05T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-11-05T10:00:00.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: 10001 })
  createdBy?: number;

  @ApiPropertyOptional({ example: 10001 })
  updatedBy?: number;
}

// Error responses omit `data`.
export type EmploymentTypeResponse =
  GenericResponseDto<EmploymentTypeResponseDto>;

export type EmploymentTypeListResponse =
  GenericListResponseDto<EmploymentTypeResponseDto>;
