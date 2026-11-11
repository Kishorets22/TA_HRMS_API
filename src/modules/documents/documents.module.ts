
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentCategory } from './document-management/entities/document-category.entity.js';
import { DocumentType } from './document-management/entities/document-type.entity.js';
import { DocumentStatus } from './document-management/entities/document-status.entity.js';
import { EmployeeDocument } from './document-management/entities/employee-document.entity.js';

import { DocumentManagementRepository } from './document-management/document-management.repository.js';

import { DocumentManagementController } from './document-management/document-management.controller.js';
import { UploadService } from './document-management/upload/upload.service.js';
import { UpdateService } from './document-management/update/update.service.js';

import { AwsS3Module } from '../../integrations/aws-s3/aws-s3.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentCategory,
      DocumentType,
      DocumentStatus,
      EmployeeDocument,
    ]),
    AwsS3Module,
  ],
  controllers: [DocumentManagementController,],
  providers: [
    UploadService,
    UpdateService,
    DocumentManagementRepository,
  ],
  exports: [
    DocumentManagementRepository,

  ],
})
export class DocumentsModule {}
