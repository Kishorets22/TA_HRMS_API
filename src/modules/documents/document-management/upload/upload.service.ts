
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { extname } from 'node:path';

import { DocumentManagementRepository } from '../document-management.repository.js';
import { DocumentStatus } from '../entities/document-status.entity.js';

import type { UploadEmployeeDocumentDto } from './dto/upload-employee-document.dto.js';
import type { UploadEmployeeDocumentResponse } from './dto/upload-employee-document-response.dto.js';

import {
  DOCUMENT_CONSTANTS,
  DOCUMENT_RESPONSES,
  prepareEmployeeDocument,
} from '../constants/document.constants.js';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    private readonly documentManagementRepository: DocumentManagementRepository,
    @InjectRepository(DocumentStatus)
    private readonly statusRepository: Repository<DocumentStatus>,
  ) {}

  async uploadEmployeeDocument(
    uploadEmployeeDocumentDto: UploadEmployeeDocumentDto,
    file: Express.Multer.File,
  ): Promise<UploadEmployeeDocumentResponse> {
    this.logger.log(
      `[DOCUMENT] Uploading "${uploadEmployeeDocumentDto.documentName}" for employee ${uploadEmployeeDocumentDto.employeeId}`,
    );

    try {
      // VALIDATE DOCUMENT FILE
      if (!file || !file.buffer || file.size === 0) {
        this.logger.warn('[DOCUMENT] Document file is missing or empty');

        return DOCUMENT_RESPONSES.invalidFile(
          'Document file is required',
        );
      }

      if (file.size > DOCUMENT_CONSTANTS.FILE.MAX_SIZE) {
        this.logger.warn(
          `[DOCUMENT] File size ${file.size} exceeds the maximum allowed size`,
        );

        return DOCUMENT_RESPONSES.invalidFile(
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

        return DOCUMENT_RESPONSES.invalidFile(
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

        return DOCUMENT_RESPONSES.invalidFile(
          'Unsupported file type',
        );
      }

      this.logger.log('[DOCUMENT] File validation completed successfully');

      // CHECK DOCUMENT TYPE
      const documentType =
        await this.documentManagementRepository.getActiveDocumentTypeById(
          uploadEmployeeDocumentDto.documentTypeId,
        );

      if (!documentType) {
        this.logger.warn(
          `[DOCUMENT] Document type ${uploadEmployeeDocumentDto.documentTypeId} not found`,
        );

        return DOCUMENT_RESPONSES.notFound(
          `Document type ${uploadEmployeeDocumentDto.documentTypeId} not found`,
        );
      }

      this.logger.log(
        `[DOCUMENT] Document type ${documentType.id} found successfully`,
      );

      // CHECK EXISTING DOCUMENT STATUSES
      const statuses = [
        DOCUMENT_CONSTANTS.STATUS.PENDING,
        DOCUMENT_CONSTANTS.STATUS.VERIFIED,
        DOCUMENT_CONSTANTS.STATUS.REJECTED,
      ];

      const existingStatuses = await this.statusRepository.find({
        where: {
          name: In(statuses),
        },
      });

      const existingStatusNames = new Set(
        existingStatuses.map((status) => status.name),
      );

      // CREATE MISSING DOCUMENT STATUSES
      const missingStatuses = statuses
        .filter((statusName) => !existingStatusNames.has(statusName))
        .map((statusName) =>
          this.statusRepository.create({
            name: statusName,
            description: `${statusName} document status`,
          }),
        );

      if (missingStatuses.length > 0) {
        await this.statusRepository.save(missingStatuses);

        this.logger.log(
          `[DOCUMENT] Created ${missingStatuses.length} missing document statuses`,
        );
      } else {
        this.logger.log(
          '[DOCUMENT] All document statuses already exist',
        );
      }

      // FETCH PENDING DOCUMENT STATUS
      const pendingStatus = await this.statusRepository.findOne({
        where: {
          name: DOCUMENT_CONSTANTS.STATUS.PENDING,
        },
      });

      if (!pendingStatus) {
        this.logger.warn(
          '[DOCUMENT] Pending document status not found',
        );

        return DOCUMENT_RESPONSES.notFound(
          'Pending document status not found',
        );
      }

      this.logger.log(
        `[DOCUMENT] Pending document status ${pendingStatus.id} retrieved successfully`,
      );

      // PREPARE EMPLOYEE DOCUMENT DETAILS
      const employeeDocument = prepareEmployeeDocument(
        uploadEmployeeDocumentDto,
        file,
        documentType.id,
        pendingStatus.id,
      );

      this.logger.log(
        '[DOCUMENT] Employee document prepared successfully',
      );

      // SAVE EMPLOYEE DOCUMENT DETAILS
      const savedDocument =
        await this.documentManagementRepository.createAndSaveEmployeeDocument(
          employeeDocument,
        );

      this.logger.log(
        `[DOCUMENT] Employee document ${savedDocument.id} saved successfully`,
      );

      // RETURN SUCCESS RESPONSE
      return DOCUMENT_RESPONSES.uploaded(savedDocument);
    } catch (error) {
      // HANDLE HTTP EXCEPTIONS
      if (error instanceof HttpException) {
        throw error;
      }

      // HANDLE UNEXPECTED ERRORS
      this.logger.error(
        `[DOCUMENT] An error occurred while uploading the Employee Document: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while uploading the Employee Document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
