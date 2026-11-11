
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

export class BranchResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'Madurai Branch' })
  branchName: string;

  @ApiPropertyOptional({ example: 'Anna Nagar, Madurai' })
  address?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-11-05T10:00:00.000Z', type: Date })
  createdAt: Date;

  @ApiProperty({ example: '2026-11-05T10:00:00.000Z', type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ example: 1 })
  updatedBy?: number;
}

// DELETE RESPONSE DATA
export class BranchDeleteDataDto {
  @ApiProperty({ description: 'Deleted branch ID', example: 1 })
  id: number;
}

// Error responses omit `data`.
export type BranchResponse = GenericResponseDto<BranchResponseDto>;

export type BranchListResponse = GenericListResponseDto<BranchResponseDto>;

export type BranchDeleteResponse = GenericResponseDto<BranchDeleteDataDto>;
