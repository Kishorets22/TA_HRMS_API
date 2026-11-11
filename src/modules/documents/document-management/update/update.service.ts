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
        this.logger.warn(`[DOCUMENT] Invalid employee document ID: ${id}`);
        return DOCUMENT_RESPONSES.invalidUpdateId(id);
      }

      // VALIDATE UPDATE FIELDS
      const hasMetadataChanges = Object.values(updateEmployeeDocumentDto).some(
        Boolean,
      );
      if (!hasMetadataChanges && !file) {
        this.logger.warn('[DOCUMENT] No document update fields were provided');
        return DOCUMENT_RESPONSES.invalidUpdate(
          'At least one document field or replacement file is required',
        );
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

        this.logger.log(
          '[DOCUMENT] Replacement file validation completed successfully',
        );
      }

      // FETCH EMPLOYEE DOCUMENT
      const document =
        await this.documentManagementRepository.getEmployeeDocumentById(id);
      if (!document) {
        this.logger.warn(`[DOCUMENT] Employee document ${id} not found`);
        return DOCUMENT_RESPONSES.updateNotFound(id);
      }
      this.logger.log(
        `[DOCUMENT] Employee document ${document.id} retrieved successfully`,
      );

      // VALIDATE AND UPDATE DOCUMENT TYPE
      if (updateEmployeeDocumentDto.documentTypeId) {
        const documentType =
          await this.documentManagementRepository.findActiveDocumentTypeById(
            updateEmployeeDocumentDto.documentTypeId,
          );
        if (!documentType) {
          this.logger.warn(
            `[DOCUMENT] Active document type ${updateEmployeeDocumentDto.documentTypeId} not found`,
          );
          return DOCUMENT_RESPONSES.updateDocumentTypeNotFound(
            updateEmployeeDocumentDto.documentTypeId,
          );
        }
        document.documentTypeId = documentType.id;
        this.logger.log(
          `[DOCUMENT] Document type updated to ${documentType.id}`,
        );
      }

      // UPDATE DOCUMENT DETAILS
      if (updateEmployeeDocumentDto.documentName) {
        document.documentName = updateEmployeeDocumentDto.documentName;
      }

      if (updateEmployeeDocumentDto.issueDate) {
        document.issueDate = new Date(updateEmployeeDocumentDto.issueDate);
      }

      if (updateEmployeeDocumentDto.expiryDate) {
        document.expiryDate = new Date(updateEmployeeDocumentDto.expiryDate);
      }

      if (updateEmployeeDocumentDto.remarks) {
        document.remarks = updateEmployeeDocumentDto.remarks;
      }

      // UPDATE DOCUMENT FILE DETAILS
      if (file) {
        Object.assign(
          document,
          prepareEmployeeDocumentFile(file, document.employeeId),
        );
        this.logger.log(
          '[DOCUMENT] Replacement file details prepared successfully',
        );
      }

      // SAVE EMPLOYEE DOCUMENT DETAILS
      const updatedDocument =
        await this.documentManagementRepository.updateEmployeeDocument(
          document,
        );

      this.logger.log(
        `[DOCUMENT] Employee document ${id} updated successfully`,
      );

      // RETURN SUCCESS RESPONSE
      return DOCUMENT_RESPONSES.updated(updatedDocument);
    } catch (error) {
      // HANDLE HTTP EXCEPTIONS
      if (error instanceof HttpException) {
        throw error;
      }

      // HANDLE UNEXPECTED ERRORS
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
