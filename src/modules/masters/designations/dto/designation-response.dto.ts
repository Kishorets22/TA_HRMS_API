
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

// DESIGNATION RESPONSE DATA
export class DesignationResponseDto {
  @ApiProperty({
    description: 'Primary key ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the designation',
    example: 'Software Engineer',
  })
  designationName: string;

  @ApiProperty({
    description: 'Department ID',
    example: 1,
    type: Number,
  })
  departmentId: number;

  @ApiProperty({
    description: 'Designation level ID',
    example: 1,
    type: Number,
  })
  levelId: number;

  @ApiProperty({
    description: 'Designation status',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-01T00:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'User ID of creator',
    example: 1,
    type: Number,
  })
  createdBy?: number;

  @ApiPropertyOptional({
    description: 'User ID of last updater',
    example: 2,
    type: Number,
  })
  updatedBy?: number;
}

// CREATE, FETCH, UPDATE RESPONSE
export type DesignationResponse =
  GenericResponseDto<DesignationResponseDto>;

// LIST RESPONSE
export type DesignationListResponse =
  GenericListResponseDto<DesignationResponseDto>;

// DELETE RESPONSE DATA
export class DesignationDeleteDataDto {
  @ApiProperty({
    description: 'Deleted designation ID',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Deleted designation name',
    example: 'Software Engineer',
  })
  designationName: string;
}

// DELETE RESPONSE
export type DesignationDeleteResponse =
  GenericResponseDto<DesignationDeleteDataDto>;
