
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

// DEPARTMENT RESPONSE DATA
export class DepartmentResponseDto {
  @ApiProperty({
    description: 'Primary key ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Company ID',
    example: 1,
    type: Number,
  })
  company_id: number;

  @ApiProperty({
    description: 'Department name',
    example: 'Information Technology',
  })
  department_name: string;

  @ApiPropertyOptional({
    description: 'Department description',
    example: 'Handles software development and IT operations',
  })
  description?: string;

  @ApiProperty({
    description: 'Department status',
    example: true,
    type: Boolean,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-01T00:00:00.000Z',
    type: Date,
  })
  updated_at: Date;

  @ApiPropertyOptional({
    description: 'User ID of creator',
    example: 1,
    type: Number,
  })
  created_by?: number;

  @ApiPropertyOptional({
    description: 'User ID of last updater',
    example: 2,
    type: Number,
  })
  updated_by?: number;
}

// CREATE, FETCH, UPDATE RESPONSE (error responses omit `data`)
export type DepartmentResponse = GenericResponseDto<DepartmentResponseDto>;

// LIST RESPONSE
export type DepartmentListResponse =
  GenericListResponseDto<DepartmentResponseDto>;

// DELETE RESPONSE DATA
export class DepartmentDeleteDataDto {
  @ApiProperty({
    description: 'Deleted department ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Deleted department name',
    example: 'Information Technology',
  })
  department_name: string;
}

// DELETE RESPONSE
export type DepartmentDeleteResponse =
  GenericResponseDto<DepartmentDeleteDataDto>;
