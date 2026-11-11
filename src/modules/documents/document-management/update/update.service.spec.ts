import { Test } from '@nestjs/testing';
import { Readable } from 'node:stream';

import { DocumentManagementRepository } from '../document-management.repository.js';
import { EmployeeDocument } from '../entities/employee-document.entity.js';
import { UpdateService } from './update.service.js';

describe('UpdateService', () => {
  let service: UpdateService;
  let document: EmployeeDocument;

  const documentManagementRepository = {
    findActiveDocumentTypeById: vi.fn(),
    getEmployeeDocumentById: vi.fn(),
    updateEmployeeDocument: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    document = Object.assign(new EmployeeDocument(), {
      id: 501,
      employeeId: 101,
      documentTypeId: 2,
      documentName: 'Degree Certificate',
      documentSource: 'EMPLOYEE_UPLOAD',
      fileName: 'degree-certificate.pdf',
      fileKey: 'temporary/101/original-degree-certificate.pdf',
      mimeType: 'application/pdf',
      fileSize: 100,
      issueDate: new Date('2024-05-15'),
      expiryDate: new Date('2029-05-15'),
      remarks: 'Original remarks',
      statusId: 1,
      updatedAt: new Date('2026-11-11T00:00:00.000Z'),
    });

    documentManagementRepository.getEmployeeDocumentById.mockResolvedValue(
      document,
    );
    documentManagementRepository.updateEmployeeDocument.mockImplementation(
      async (updatedDocument: EmployeeDocument) => updatedDocument,
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateService,
        {
          provide: DocumentManagementRepository,
          useValue: documentManagementRepository,
        },
      ],
    }).compile();

    service = moduleRef.get(UpdateService);
  });

  it('updates supplied metadata and preserves omitted fields', async () => {
    const response = await service.updateEmployeeDocument(501, {
      documentName: 'Updated Degree Certificate',
    });

    expect(response.statusCode).toBe(200);
    expect(response.data?.documentName).toBe('Updated Degree Certificate');
    expect(document.fileName).toBe('degree-certificate.pdf');
    expect(document.remarks).toBe('Original remarks');
    expect(
      documentManagementRepository.updateEmployeeDocument,
    ).toHaveBeenCalledWith(document);
  });

  it('replaces the file using a unique employee-scoped key', async () => {
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'updated-certificate.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 3,
      stream: Readable.from('pdf'),
      destination: '',
      filename: 'updated-certificate.pdf',
      path: '',
      buffer: Buffer.from('pdf'),
    };

    const response = await service.updateEmployeeDocument(501, {}, file);

    expect(response.statusCode).toBe(200);
    expect(document.fileName).toBe('updated-certificate.pdf');
    expect(document.fileKey).toMatch(
      /^temporary\/101\/.+-updated-certificate\.pdf$/,
    );
    expect(document.fileSize).toBe(3);
  });

  it('returns a bad request when no update fields are provided', async () => {
    const response = await service.updateEmployeeDocument(501, {});

    expect(response.statusCode).toBe(400);
    expect(
      documentManagementRepository.updateEmployeeDocument,
    ).not.toHaveBeenCalled();
  });

  it('returns not found when the document does not exist', async () => {
    documentManagementRepository.getEmployeeDocumentById.mockResolvedValue(
      null,
    );

    const response = await service.updateEmployeeDocument(501, {
      documentName: 'Updated Degree Certificate',
    });

    expect(response.statusCode).toBe(404);
    expect(
      documentManagementRepository.updateEmployeeDocument,
    ).not.toHaveBeenCalled();
  });

  it('returns not found for an inactive document type', async () => {
    documentManagementRepository.findActiveDocumentTypeById.mockResolvedValue(
      null,
    );

    const response = await service.updateEmployeeDocument(501, {
      documentTypeId: 3,
    });

    expect(response.statusCode).toBe(404);
    expect(
      documentManagementRepository.updateEmployeeDocument,
    ).not.toHaveBeenCalled();
  });
});
