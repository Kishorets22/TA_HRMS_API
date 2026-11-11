import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { extname } from 'node:path';

import { DocumentManagementRepository } from '../document-management.repository.js';
import {
  DOCUMENT_CONSTANTS,
  DOCUMENT_RESPONSES,
  prepareEmployeeDocumentFile,
} from '../constants/document.constants.js';
import { isValidDocumentId } from '../../utils/document-validation.utils.js';

import type { UpdateEmployeeDocumentDto } from './dto/update-employee-document.dto.js';
import type { UpdateEmployeeDocumentResponse } from './dto/update-employee-document-response.dto.js';

@Injectable()
export class UpdateService {
  private readonly logger = new Logger(UpdateService.name);

  constructor(
    private readonly documentManagementRepository: DocumentManagementRepository,
  ) {}

  async updateEmployeeDocument(
    id: number,
    updateEmployeeDocumentDto: UpdateEmployeeDocumentDto,
    file?: Express.Multer.File,
  ): Promise<UpdateEmployeeDocumentResponse> {
    this.logger.log(`[DOCUMENT] Updating employee document ${id}`);
    try {
      // VALIDATE EMPLOYEE DOCUMENT ID
      if (!isValidDocumentId(id)) {
        return DOCUMENT_RESPONSES.invalidUpdateId(id);
      }

      const employeeDocument =
        await this.documentManagementRepository.getEmployeeDocumentById(id);
      if (!employeeDocument) {
        this.logger.warn(`[DOCUMENT] Employee document ${id} not found`);
        return DOCUMENT_RESPONSES.updateNotFound(id);
      }

      // VALIDATE REPLACEMENT DOCUMENT FILE
      if (file) {
        if (!file.buffer || file.size === 0) {
          this.logger.warn('[DOCUMENT] Replacement file is missing or empty');
          return DOCUMENT_RESPONSES.invalidUpdateFile(
            'Document file is required',
          );
        }

        if (file.size > DOCUMENT_CONSTANTS.FILE.MAX_SIZE) {
          this.logger.warn(
            `[DOCUMENT] Replacement file size ${file.size} exceeds the maximum allowed size`,
          );
          return DOCUMENT_RESPONSES.invalidUpdateFile(
            'File size must not exceed 5 MB',
          );
        }

        // CHECK FILE EXTENSION
        const extension = extname(file.originalname).toLowerCase();
        if (
          !DOCUMENT_CONSTANTS.FILE.ALLOWED_EXTENSIONS.includes(
            extension as (typeof DOCUMENT_CONSTANTS.FILE.ALLOWED_EXTENSIONS)[number],
          )
        ) {
          this.logger.warn(
            `[DOCUMENT] Unsupported file extension: ${extension}`,
          );
          return DOCUMENT_RESPONSES.invalidUpdateFile(
            'Unsupported file extension',
          );
        }

        // CHECK FILE MIME TYPE
        if (
          !DOCUMENT_CONSTANTS.FILE.ALLOWED_MIME_TYPES.includes(
            file.mimetype as (typeof DOCUMENT_CONSTANTS.FILE.ALLOWED_MIME_TYPES)[number],
          )
        ) {
          this.logger.warn(
            `[DOCUMENT] Unsupported MIME type: ${file.mimetype}`,
          );
          return DOCUMENT_RESPONSES.invalidUpdateFile('Unsupported file type');
        }

        this.logger.log('[DOCUMENT] Replacement file validated successfully');
      }

      const documentTypeId =
        updateEmployeeDocumentDto.documentTypeId ??
        employeeDocument.documentTypeId;
      if (documentTypeId !== employeeDocument.documentTypeId) {
        const documentType =
          await this.documentManagementRepository.findActiveDocumentTypeById(
            documentTypeId,
          );
        if (!documentType) {
          this.logger.warn(
            `[DOCUMENT] Active document type ${documentTypeId} not found`,
          );
          return DOCUMENT_RESPONSES.updateDocumentTypeNotFound(documentTypeId);
        }
      }

      // ASSIGN ONLY THE EDITABLE FIELDS
      employeeDocument.documentTypeId = documentTypeId;
      employeeDocument.documentName =
        updateEmployeeDocumentDto.documentName ?? employeeDocument.documentName;
      if (updateEmployeeDocumentDto.issueDate) {
        employeeDocument.issueDate = new Date(
          updateEmployeeDocumentDto.issueDate,
        );
      }

      if (updateEmployeeDocumentDto.expiryDate) {
        employeeDocument.expiryDate = new Date(
          updateEmployeeDocumentDto.expiryDate,
        );
      }

      employeeDocument.remarks =
        updateEmployeeDocumentDto.remarks ?? employeeDocument.remarks;

      // UPDATE DOCUMENT FILE DETAILS
      if (file) {
        Object.assign(
          employeeDocument,
          prepareEmployeeDocumentFile(file, employeeDocument.employeeId),
        );
      }

      // SAVE UPDATED EMPLOYEE DOCUMENT
      const updatedDocument =
        await this.documentManagementRepository.updateEmployeeDocument(
          employeeDocument,
        );
      this.logger.log(
        `[DOCUMENT] Employee document ${updatedDocument.id} updated successfully`,
      );

      return DOCUMENT_RESPONSES.updated(updatedDocument);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DOCUMENT] An error occurred while updating Employee Document ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Employee Document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
