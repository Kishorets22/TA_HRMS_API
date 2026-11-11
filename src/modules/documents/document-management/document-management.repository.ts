
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeepPartial } from 'typeorm';
import { Repository } from 'typeorm';

import { EmployeeDocument } from './entities/employee-document.entity.js';
import { DocumentType } from './entities/document-type.entity.js';
import { DocumentCategory } from './entities/document-category.entity.js';

@Injectable()
export class DocumentManagementRepository {
  constructor(
    @InjectRepository(EmployeeDocument)
    private readonly employeeDocumentRepository: Repository<EmployeeDocument>,

    @InjectRepository(DocumentType)
    private readonly documentTypeRepository: Repository<DocumentType>,

    @InjectRepository(DocumentCategory)
    private readonly documentCategoryRepository: Repository<DocumentCategory>,
  ) {}

  // ==========================================
  // EMPLOYEE DOCUMENT OPERATIONS
  // ==========================================

  // CREATE EMPLOYEE DOCUMENT
  async createAndSaveEmployeeDocument(
    employeeDocument: DeepPartial<EmployeeDocument>,
  ): Promise<EmployeeDocument> {
    const document =
      this.employeeDocumentRepository.create(employeeDocument);

    return this.employeeDocumentRepository.save(document);
  }
  // GET ACTIVE DOCUMENT TYPE BY ID
getActiveDocumentTypeById(id: number): Promise<DocumentType> {
  return this.documentTypeRepository.findOneByOrFail({
    id,
    isActive: true,
  });
}

  // GET EMPLOYEE DOCUMENT BY ID
  getEmployeeDocumentById(id: number): Promise<EmployeeDocument | null> {
    return this.employeeDocumentRepository.findOne({
      where: { id },
      relations: {
        documentType: true,
        status: true,
      },
    });
  }

  // GET ALL EMPLOYEE DOCUMENTS BY EMPLOYEE ID
  getEmployeeDocumentsByEmployeeId(
    employeeId: number,
  ): Promise<EmployeeDocument[]> {
    return this.employeeDocumentRepository.find({
      where: { employeeId },
      relations: {
        documentType: true,
        status: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // ==========================================
  // DOCUMENT TYPE OPERATIONS
  // ==========================================

  // Add existing document type repository methods here.

  // ==========================================
  // DOCUMENT CATEGORY OPERATIONS
  // ==========================================

  // GET ALL ACTIVE DOCUMENT CATEGORIES
  async findAllActiveDocumentCategories(): Promise<DocumentCategory[]> {
    return this.documentCategoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  // GET DOCUMENT CATEGORY BY ID
  findDocumentCategoryById(id: number): Promise<DocumentCategory> {
    return this.documentCategoryRepository.findOneByOrFail({ id });
  }
}
