import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { DocumentManagementRepository } from '../document-management.repository.js';
import {
  DOCUMENT_RESPONSES,
  prepareEmployeeDocumentFile,
} from '../constants/document.constants.js';
import {
  isValidDocumentId,
  validateDocumentFile,
} from '../../utils/document-validation.utils.js';

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
      if (!isValidDocumentId(id)) {
        return DOCUMENT_RESPONSES.invalidUpdateId(id);
      }

      const hasMetadataChanges = Object.values(updateEmployeeDocumentDto).some(
        Boolean,
      );

      if (!hasMetadataChanges && !file) {
        this.logger.warn('[DOCUMENT] No document update fields were provided');
        return DOCUMENT_RESPONSES.invalidUpdate(
          'At least one document field or replacement file is required',
        );
      }

      if (file) {
        try {
          validateDocumentFile(file);
        } catch (error) {
          if (error instanceof BadRequestException) {
            this.logger.warn(`[DOCUMENT] ${error.message}`);
            return DOCUMENT_RESPONSES.invalidUpdateFile(error.message);
          }

          throw error;
        }
      }

      const document =
        await this.documentManagementRepository.getEmployeeDocumentById(id);

      if (!document) {
        this.logger.warn(`[DOCUMENT] Employee document ${id} not found`);
        return DOCUMENT_RESPONSES.updateNotFound(id);
      }

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
      }

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

      if (file) {
        Object.assign(
          document,
          prepareEmployeeDocumentFile(file, document.employeeId),
        );
      }

      const updatedDocument =
        await this.documentManagementRepository.updateEmployeeDocument(
          document,
        );

      this.logger.log(
        `[DOCUMENT] Employee document ${id} updated successfully`,
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
