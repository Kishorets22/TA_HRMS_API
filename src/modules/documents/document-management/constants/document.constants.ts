
import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { basename } from 'node:path';

import type { DeepPartial } from 'typeorm';

import type { EmployeeDocument } from '../entities/employee-document.entity.js';
import type { UploadEmployeeDocumentDto } from '../upload/dto/upload-employee-document.dto.js';

import type {
  UploadEmployeeDocumentResponse,
  UploadEmployeeDocumentResponseDto,
} from '../upload/dto/upload-employee-document-response.dto.js';

export const DOCUMENT_CONSTANTS = {
  SOURCE: {
    EMPLOYEE_UPLOAD: 'EMPLOYEE_UPLOAD',
  },

  STATUS: {
    PENDING: 'PENDING',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED',
  },

  FILE: {
    MAX_SIZE: 5 * 1024 * 1024,

    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
    ],

    ALLOWED_EXTENSIONS: [
      '.pdf',
      '.doc',
      '.docx',
      '.png',
      '.jpg',
      '.jpeg',
    ],
  },
} as const;

// PREPARE EMPLOYEE DOCUMENT
export function prepareEmployeeDocument(
  uploadEmployeeDocumentDto: UploadEmployeeDocumentDto,
  file: Express.Multer.File,
  documentTypeId: number,
  statusId: number,
): DeepPartial<EmployeeDocument> {
  const fileName = basename(file.originalname);

  return {
    employeeId: uploadEmployeeDocumentDto.employeeId,
    documentTypeId,
    documentName: uploadEmployeeDocumentDto.documentName,
    documentSource: DOCUMENT_CONSTANTS.SOURCE.EMPLOYEE_UPLOAD,
    fileName,
    fileKey: `temporary/${uploadEmployeeDocumentDto.employeeId}/${randomUUID()}-${fileName}`,
    mimeType: file.mimetype,
    fileSize: file.size,
    issueDate: new Date(uploadEmployeeDocumentDto.issueDate),
    expiryDate: new Date(uploadEmployeeDocumentDto.expiryDate),
    statusId,
    remarks: uploadEmployeeDocumentDto.remarks,
    createdBy: uploadEmployeeDocumentDto.employeeId,
  };
}

// DOCUMENT RESPONSES
export const DOCUMENT_RESPONSES = {
  // UPLOAD EMPLOYEE DOCUMENT
  uploaded: (
    document: EmployeeDocument,
  ): UploadEmployeeDocumentResponse => ({
    success: true,
    message: 'Employee document uploaded successfully',
    statusCode: HttpStatus.CREATED,
    data: {
      id: document.id,
      employeeId: document.employeeId,
      documentTypeId: document.documentTypeId,
      documentName: document.documentName,
      documentSource: document.documentSource,
      fileName: document.fileName,
      mimeType: document.mimeType,
      fileSize: document.fileSize ?? undefined,
      issueDate: document.issueDate?.toISOString(),
      expiryDate: document.expiryDate?.toISOString(),
      statusId: document.statusId,
      createdAt: document.createdAt,
    } satisfies UploadEmployeeDocumentResponseDto,
  }),

  // NOT FOUND
  notFound: (message: string): UploadEmployeeDocumentResponse => ({
    success: false,
    message,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID FILE
  invalidFile: (message: string): UploadEmployeeDocumentResponse => ({
    success: false,
    message,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // INTERNAL ERROR
  internalError: (action: string): UploadEmployeeDocumentResponse => ({
    success: false,
    message: `An error occurred while ${action} the employee document`,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  }),
};
