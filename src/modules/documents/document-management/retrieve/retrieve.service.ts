import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { DocumentManagementRepository } from '../document-management.repository.js';
import { DOCUMENT_RESPONSES } from '../constants/document.constants.js';
import { isValidDocumentId } from '../../utils/document-validation.utils.js';

import type {
  RetrieveEmployeeDocumentListResponse,
  RetrieveEmployeeDocumentResponse,
} from './dto/retrieve-employee-document-response.dto.js';

@Injectable()
export class RetrieveService {
  private readonly logger = new Logger(RetrieveService.name);

  constructor(
    private readonly documentManagementRepository: DocumentManagementRepository,
  ) {}

  async retrievingEmployeeDocumentById(
    id: number,
  ): Promise<RetrieveEmployeeDocumentResponse> {
    try {
      if (!isValidDocumentId(id)) {
        return DOCUMENT_RESPONSES.invalidRetrieveId(id);
      }

      const employeeDocument =
        await this.documentManagementRepository.getEmployeeDocumentById(id);
      if (!employeeDocument) {
        this.logger.warn(`[DOCUMENT] Employee document ${id} not found`);
        return DOCUMENT_RESPONSES.retrieveNotFound(id);
      }

      this.logger.log(`[DOCUMENT] Employee document ${id} retrieved`);

      return DOCUMENT_RESPONSES.retrieved(employeeDocument);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DOCUMENT] An error occurred while retrieving Employee Document ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Employee Document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retrievingEmployeeDocumentsByEmployeeId(
    employeeId: number,
  ): Promise<RetrieveEmployeeDocumentListResponse> {
    try {
      if (!isValidDocumentId(employeeId)) {
        return DOCUMENT_RESPONSES.invalidRetrieveEmployeeId(employeeId);
      }

      const employeeDocuments =
        await this.documentManagementRepository.getEmployeeDocumentsByEmployeeId(
          employeeId,
        );

      this.logger.log(
        `[DOCUMENT] Retrieved ${employeeDocuments.length} documents for employee ${employeeId}`,
      );

      return DOCUMENT_RESPONSES.retrievedForEmployee(employeeDocuments);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DOCUMENT] An error occurred while retrieving documents for employee ${employeeId}: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving Employee Documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
