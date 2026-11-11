
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import type { Response } from 'express';

import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { DOCUMENT_CONSTANTS } from './constants/document.constants.js';
import { UploadService } from './upload/upload.service.js';
import { UploadEmployeeDocumentDto } from './upload/dto/upload-employee-document.dto.js';
import { UploadEmployeeDocumentResponseDto } from './upload/dto/upload-employee-document-response.dto.js';
import type { UploadEmployeeDocumentResponse } from './upload/dto/upload-employee-document-response.dto.js';

import { UpdateService } from './update/update.service.js';
import { UpdateEmployeeDocumentDto } from './update/dto/update-employee-document.dto.js';
import { UpdateEmployeeDocumentResponseDto } from './update/dto/update-employee-document-response.dto.js';
import type { UpdateEmployeeDocumentResponse } from './update/dto/update-employee-document-response.dto.js';

import { RetrieveService } from './retrieve/retrieve.service.js';
import { RetrieveEmployeeDocumentResponseDto } from './retrieve/dto/retrieve-employee-document-response.dto.js';

import type {
  RetrieveEmployeeDocumentListResponse,
  RetrieveEmployeeDocumentResponse,
} from './retrieve/dto/retrieve-employee-document-response.dto.js';

import { ArchiveService } from './archive/archive.service.js';
import { ArchiveEmployeeDocumentResponseDto } from './archive/dto/archive-employee-document-response.dto.js';

import type { ArchiveEmployeeDocumentResponse } from './archive/dto/archive-employee-document-response.dto.js';

@ApiTags('Employee Documents')
@Controller('v1')
export class DocumentManagementController {
  private readonly logger = new Logger(DocumentManagementController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly updateService: UpdateService,
    private readonly retrieveService: RetrieveService,
    private readonly archiveService: ArchiveService,
  ) {}

  // UPLOAD EMPLOYEE DOCUMENT
  @Post('employee-document/upload')
  @ApiOperation({
    summary: 'Upload an employee document',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        employeeId: {
          type: 'integer',
          example: 101,
        },
        documentTypeId: {
          type: 'integer',
          example: 2,
        },
        documentName: {
          type: 'string',
          example: 'Degree Certificate',
        },
        issueDate: {
          type: 'string',
          format: 'date',
          example: '2024-05-15',
        },
        expiryDate: {
          type: 'string',
          format: 'date',
          example: '2029-05-15',
        },
        remarks: {
          type: 'string',
          example: 'Verified original certificate',
        },
      },
      required: [
        'file',
        'employeeId',
        'documentTypeId',
        'documentName',
        'issueDate',
        'expiryDate',
        'remarks',
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Employee document uploaded successfully',
    type: UploadEmployeeDocumentResponseDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadEmployeeDocument(
    @Body() dto: UploadEmployeeDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadEmployeeDocumentResponse> {
    try {
      return await this.uploadService.uploadEmployeeDocument(dto, file);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'An error occurred while uploading the Employee Document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // RETRIEVE EMPLOYEE DOCUMENT BY ID
  @Get('employee-document/:id')
  @ApiOperation({ summary: 'Get an employee document by ID' })
  @ApiParam({ name: 'id', example: 501 })
  @ApiExtraModels(RetrieveEmployeeDocumentResponseDto)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee document retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        statusCode: { type: 'number', example: HttpStatus.OK },
        data: { $ref: getSchemaPath(RetrieveEmployeeDocumentResponseDto) },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid employee document ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee document not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An unexpected error occurred while retrieving the document',
  })
  async retrieveEmployeeDocumentById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RetrieveEmployeeDocumentResponse> {
    try {
      const response =
        await this.retrieveService.retrievingEmployeeDocumentById(id);

      res.status(response.statusCode);

      return response;
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

  // RETRIEVE EMPLOYEE DOCUMENTS BY EMPLOYEE ID
  @Get('employee/:employeeId/documents')
  @ApiOperation({ summary: 'Get all documents for an employee' })
  @ApiParam({ name: 'employeeId', example: 101 })
  @ApiExtraModels(RetrieveEmployeeDocumentResponseDto)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee documents retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        statusCode: { type: 'number', example: HttpStatus.OK },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(RetrieveEmployeeDocumentResponseDto) },
        },
        total: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid employee ID',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description:
      'An unexpected error occurred while retrieving employee documents',
  })
  async retrieveEmployeeDocumentsByEmployeeId(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RetrieveEmployeeDocumentListResponse> {
    try {
      const response =
        await this.retrieveService.retrievingEmployeeDocumentsByEmployeeId(
          employeeId,
        );

      res.status(response.statusCode);

      return response;
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

  // ARCHIVE EMPLOYEE DOCUMENT
  @Patch('employee-document/:id/archive')
  @ApiOperation({ summary: 'Archive an employee document' })
  @ApiParam({ name: 'id', example: 501 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee document archived successfully',
    type: ArchiveEmployeeDocumentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid employee document ID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee document not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An unexpected error occurred while archiving the document',
  })
  async archiveEmployeeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ArchiveEmployeeDocumentResponse> {
    try {
      const response = await this.archiveService.archiveEmployeeDocument(id);

      res.status(response.statusCode);

      return response;
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

  // UPDATE EMPLOYEE DOCUMENT
  @Patch('employee-document/:id')
  @ApiOperation({
    summary: 'Update an employee document',
    description:
      'Updates the supplied document metadata and optionally replaces its file. Omitted fields remain unchanged.',
  })
  @ApiParam({
    name: 'id',
    description: 'Employee document ID',
    example: 501,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Optional replacement file (maximum 5 MB)',
        },
        documentTypeId: {
          type: 'integer',
          example: 2,
        },
        documentName: {
          type: 'string',
          example: 'Degree Certificate',
          maxLength: 200,
        },
        issueDate: {
          type: 'string',
          format: 'date',
          example: '2024-05-15',
        },
        expiryDate: {
          type: 'string',
          format: 'date',
          example: '2029-05-15',
        },
        remarks: {
          type: 'string',
          example: 'Verified original certificate',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Employee document updated successfully',
    type: UpdateEmployeeDocumentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid document ID, file, or update fields',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Employee document or active document type not found',
  })
  @ApiResponse({
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    description: 'Replacement file exceeds the 5 MB limit',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An unexpected error occurred while updating the document',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: DOCUMENT_CONSTANTS.FILE.MAX_SIZE,
      },
    }),
  )
  async updateEmployeeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDocumentDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UpdateEmployeeDocumentResponse> {
    try {
      const response = await this.updateService.updateEmployeeDocument(
        id,
        dto,
        file,
      );

      res.status(response.statusCode);

      return response;
    } catch (error: unknown) {
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
