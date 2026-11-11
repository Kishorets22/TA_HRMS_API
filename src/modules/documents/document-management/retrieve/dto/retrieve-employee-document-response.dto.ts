import { ApiProperty } from '@nestjs/swagger';

import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../../common/dto/generics/generic-response.dto.js';

export class RetrieveEmployeeDocumentResponseDto {
  @ApiProperty({ example: 501 })
  id: number;

  @ApiProperty({ example: 101 })
  employeeId: number;

  @ApiProperty({ example: 2 })
  documentTypeId: number;

  @ApiProperty({ example: 'Degree Certificate' })
  documentTypeName: string;

  @ApiProperty({ example: 'Degree Certificate' })
  documentName: string;

  @ApiProperty({ example: 'EMPLOYEE_UPLOAD' })
  documentSource: string;

  @ApiProperty({ example: 'degree-certificate.pdf' })
  fileName: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ example: 204800 })
  fileSize: number;

  @ApiProperty({ example: '2024-05-15' })
  issueDate: string;

  @ApiProperty({ example: '2029-05-15' })
  expiryDate: string;

  @ApiProperty({ example: 'Verified original certificate' })
  remarks: string;

  @ApiProperty({ example: 1 })
  statusId: number;

  @ApiProperty({ example: 'PENDING' })
  statusName: string;

  @ApiProperty({ example: '2026-11-10T09:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-11-10T09:30:00.000Z' })
  updatedAt: Date;
}

export type RetrieveEmployeeDocumentResponse =
  GenericResponseDto<RetrieveEmployeeDocumentResponseDto>;

export type RetrieveEmployeeDocumentListResponse =
  GenericListResponseDto<RetrieveEmployeeDocumentResponseDto>;
