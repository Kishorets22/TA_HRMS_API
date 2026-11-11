
import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { UploadService } from './upload/upload.service.js';

import { UploadEmployeeDocumentDto } from './upload/dto/upload-employee-document.dto.js';

import { UploadEmployeeDocumentResponseDto } from './upload/dto/upload-employee-document-response.dto.js';

import type { UploadEmployeeDocumentResponse } from './upload/dto/upload-employee-document-response.dto.js';

@ApiTags('Employee Documents')
@Controller('v1')
export class DocumentManagementController {
  constructor(
    private readonly uploadService: UploadService,
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
}
