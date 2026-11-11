
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

import type { UpdateEmployeeDocumentResponse } from '../update/dto/update-employee-document-response.dto.js';

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
  return {
    employeeId: uploadEmployeeDocumentDto.employeeId,
    documentTypeId,
    documentName: uploadEmployeeDocumentDto.documentName,
    documentSource: DOCUMENT_CONSTANTS.SOURCE.EMPLOYEE_UPLOAD,
    ...prepareEmployeeDocumentFile(file, uploadEmployeeDocumentDto.employeeId),
    issueDate: new Date(uploadEmployeeDocumentDto.issueDate),
    expiryDate: new Date(uploadEmployeeDocumentDto.expiryDate),
    statusId,
    remarks: uploadEmployeeDocumentDto.remarks,
    createdBy: uploadEmployeeDocumentDto.employeeId,
  };
}

export function prepareEmployeeDocumentFile(
  file: Express.Multer.File,
  employeeId: number,
): Pick<
  DeepPartial<EmployeeDocument>,
  'fileName' | 'fileKey' | 'mimeType' | 'fileSize'
> {
  const fileName = basename(file.originalname);

  return {
    fileName,
    fileKey: `temporary/${employeeId}/${randomUUID()}-${fileName}`,
    mimeType: file.mimetype,
    fileSize: file.size,
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
      issueDate: document.issueDate
        ? new Date(document.issueDate).toISOString()
        : undefined,
      expiryDate: document.expiryDate
        ? new Date(document.expiryDate).toISOString()
        : undefined,
      statusId: document.statusId,
      createdAt: document.createdAt,
    } satisfies UploadEmployeeDocumentResponseDto,
  }),

  // UPDATE EMPLOYEE DOCUMENT
  updated: (document: EmployeeDocument): UpdateEmployeeDocumentResponse => ({
    success: true,
    message: 'Employee document updated successfully',
    statusCode: HttpStatus.OK,
    data: {
      id: document.id,
      employeeId: document.employeeId,
      documentTypeId: document.documentTypeId,
      documentName: document.documentName,
      documentSource: document.documentSource,
      fileName: document.fileName,
      mimeType: document.mimeType,
      fileSize: document.fileSize ?? undefined,
      issueDate: document.issueDate
        ? new Date(document.issueDate).toISOString()
        : undefined,
      expiryDate: document.expiryDate
        ? new Date(document.expiryDate).toISOString()
        : undefined,
      statusId: document.statusId,
      updatedAt: document.updatedAt,
    },
  }),

  // INVALID DOCUMENT ID
  invalidUpdateId: (id: number): UpdateEmployeeDocumentResponse => ({
    success: false,
    message: `Invalid employee document ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // UPDATE NOT FOUND
  updateNotFound: (id: number): UpdateEmployeeDocumentResponse => ({
    success: false,
    message: `Employee document with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // DOCUMENT TYPE NOT FOUND
  updateDocumentTypeNotFound: (
    id: number,
  ): UpdateEmployeeDocumentResponse => ({
    success: false,
    message: `Active document type with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID UPDATE
  invalidUpdate: (message: string): UpdateEmployeeDocumentResponse => ({
    success: false,
    message,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // INVALID FILE DURING UPDATE
  invalidUpdateFile: (message: string): UpdateEmployeeDocumentResponse => ({
    success: false,
    message,
    statusCode: HttpStatus.BAD_REQUEST,
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
