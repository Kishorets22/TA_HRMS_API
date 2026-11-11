
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import type { GenericResponseDto } from '../../../../../common/dto/generics/generic-response.dto.js';

export class UploadEmployeeDocumentResponseDto {
  @ApiProperty({ example: 501 })
  id: number;

  @ApiProperty({ example: 101 })
  employeeId: number;

  @ApiProperty({ example: 2 })
  documentTypeId: number;

  @ApiProperty({ example: 'Degree Certificate' })
  documentName: string;

  @ApiProperty({ example: 'degree-certificate.pdf' })
  fileName: string;

  @ApiPropertyOptional({
    description: 'Uploaded document MIME type',
    example: 'application/pdf',
  })
  mimeType?: string;

  @ApiPropertyOptional({ example: 204800 })
  fileSize?: number;

  @ApiPropertyOptional({ example: '2024-05-15' })
  issueDate?: string;

  @ApiPropertyOptional({ example: '2029-05-15' })
  expiryDate?: string;

  @ApiProperty({ example: 1 })
  statusId: number;

  @ApiProperty({
    description: 'Source of the uploaded document',
    example: 'EMPLOYEE_UPLOAD',
  })
  documentSource: string;

  @ApiProperty({ example: '2026-11-10T09:30:00.000Z' })
  createdAt: Date;
}

export type UploadEmployeeDocumentResponse =
  GenericResponseDto<UploadEmployeeDocumentResponseDto>;
