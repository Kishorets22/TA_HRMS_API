import { ApiProperty } from '@nestjs/swagger';

import type { GenericResponseDto } from '../../../../../common/dto/generics/generic-response.dto.js';

export class ArchiveEmployeeDocumentResponseDto {
  @ApiProperty({ example: 501 })
  id: number;

  @ApiProperty({ example: 101 })
  employeeId: number;

  @ApiProperty({ example: '2026-11-11T09:30:00.000Z' })
  archivedAt: Date;
}

export type ArchiveEmployeeDocumentResponse =
  GenericResponseDto<ArchiveEmployeeDocumentResponseDto>;
