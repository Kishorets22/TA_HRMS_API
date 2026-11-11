
import {
  Body,
  Controller,
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
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

@ApiTags('Employee Documents')
@Controller('v1')
export class DocumentManagementController {
  private readonly logger = new Logger(DocumentManagementController.name);

  constructor(
    private readonly uploadService: UploadService,
    private readonly updateService: UpdateService,
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
