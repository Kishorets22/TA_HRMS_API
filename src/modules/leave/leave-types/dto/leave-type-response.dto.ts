import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

import type { LeaveUnit } from '../entities/leave-type.entity.js';

export class LeaveTypeResponseDto {
  @ApiProperty({ description: 'Primary key ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Unique leave type code', example: 'CASUAL' })
  code: string;

  @ApiProperty({ description: 'Name of the leave type', example: 'Casual Leave' })
  name: string;

  @ApiProperty({
    description: 'Leave unit',
    example: 'DAYS',
    enum: ['DAYS', 'HOURS'],
  })
  unit: LeaveUnit;

  @ApiProperty({ description: 'Whether the leave type is active', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether this is a compensatory leave type',
    example: false,
  })
  isCompensatory: boolean;

  @ApiPropertyOptional({
    description: 'Maximum carry-forward days allowed',
    example: '5.00',
  })
  maxCarryForwardDays?: string;

  @ApiPropertyOptional({
    description: 'ID of the user who created the record',
    example: 1,
  })
  createdBy?: number;

  @ApiPropertyOptional({
    description: 'ID of the user who last updated the record',
    example: 1,
  })
  updatedBy?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-11-10T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-11-10T10:00:00.000Z',
  })
  updatedAt: Date;
}

// DELETE RESPONSE DATA
export class LeaveTypeDeleteDataDto {
  @ApiProperty({ description: 'Deleted leave type ID', example: 1 })
  id: number;
}

// Error responses omit `data`.
export type LeaveTypeResponse = GenericResponseDto<LeaveTypeResponseDto>;

export type LeaveTypeListResponse =
  GenericListResponseDto<LeaveTypeResponseDto>;

export type LeaveTypeDeleteResponse =
  GenericResponseDto<LeaveTypeDeleteDataDto>;