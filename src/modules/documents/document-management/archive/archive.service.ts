import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { DocumentManagementRepository } from '../document-management.repository.js';
import { DOCUMENT_RESPONSES } from '../constants/document.constants.js';
import { isValidDocumentId } from '../../utils/document-validation.utils.js';

import type { ArchiveEmployeeDocumentResponse } from './dto/archive-employee-document-response.dto.js';

@Injectable()
export class ArchiveService {
  private readonly logger = new Logger(ArchiveService.name);

  constructor(
    private readonly documentManagementRepository: DocumentManagementRepository,
  ) {}

  async archiveEmployeeDocument(
    id: number,
  ): Promise<ArchiveEmployeeDocumentResponse> {
    try {
      if (!isValidDocumentId(id)) {
        return DOCUMENT_RESPONSES.invalidArchiveId(id);
      }

      const employeeDocument =
        await this.documentManagementRepository.getEmployeeDocumentById(id);
      if (!employeeDocument) {
        this.logger.warn(`[DOCUMENT] Employee document ${id} not found`);
        return DOCUMENT_RESPONSES.archiveNotFound(id);
      }

      employeeDocument.archivedAt = new Date();

      const archivedDocument =
        await this.documentManagementRepository.archiveEmployeeDocument(
          employeeDocument,
        );
      this.logger.log(
        `[DOCUMENT] Employee document ${archivedDocument.id} archived`,
      );

      return DOCUMENT_RESPONSES.archived(archivedDocument);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DOCUMENT] An error occurred while archiving Employee Document ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while archiving the Employee Document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
