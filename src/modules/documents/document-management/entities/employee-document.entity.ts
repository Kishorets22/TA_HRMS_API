
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentType } from './document-type.entity.js';
import { DocumentStatus } from './document-status.entity.js';

@Entity('employee_documents')
export class EmployeeDocument {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    comment: 'Primary key ID',
  })
  id: number;

  // TODO(employees): map the FK to employees(id) once the Employees module exists.
  @Column({
    name: 'employee_id',
    type: 'bigint',
    comment: 'Employee associated with the document',
  })
  employeeId: number;

  @Column({
    name: 'document_type_id',
    type: 'bigint',
    comment: 'Document type associated with the document',
  })
  documentTypeId: number;

  @ManyToOne(() => DocumentType, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'document_type_id',
    foreignKeyConstraintName:
      'fk_employee_documents_document_type_id_document_types_id',
  })
  documentType: DocumentType;

  @Column({
    name: 'document_source',
    type: 'varchar',
    length: 30,
    comment: 'Source from which the document was uploaded or generated',
  })
  documentSource: string;

  @Column({
    name: 'document_name',
    type: 'varchar',
    length: 200,
    comment: 'Display name of the document',
  })
  documentName: string;

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: 255,
    comment: 'Original name of the uploaded file',
  })
  fileName: string;

  @Column({
    name: 'file_key',
    type: 'varchar',
    length: 500,
    comment: 'Storage key or path of the document file',
  })
  fileKey: string;

@Column({
  name: 'mime_type',
  type: 'varchar',
  length: 100,
  nullable: false,
  comment: 'Uploaded document MIME type',
})
mimeType: string;
@Column({
  name: 'file_size',
  type: 'bigint',
  nullable: false,
  comment: 'Size of the document file in bytes',
})
fileSize: number;

@Column({
  name: 'issue_date',
  type: 'date',
  nullable: false,
  comment: 'Date on which the document was issued',
})
issueDate: Date;

@Column({
  name: 'expiry_date',
  type: 'date',
  nullable: false,
  comment: 'Expiry date of the document',
})
expiryDate: Date;

@Column({
  name: 'remarks',
  type: 'text',
  nullable: false,
  comment: 'Additional remarks about the document',
})
remarks: string;

  @Column({
    name: 'status_id',
    type: 'bigint',
    comment: 'Current verification status of the document',
  })
  statusId: number;

  @ManyToOne(() => DocumentStatus, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'status_id',
    foreignKeyConstraintName:
      'fk_employee_documents_status_id_document_statuses_id',
  })
  status: DocumentStatus;

@Column({
  name: 'archived_at',
  type: 'timestamp',
  nullable: false,
  comment: 'Date and time when the document was archived',
})
archivedAt: Date;

// Letter-related fields retained from the existing HRMS schema.
@Column({
  name: 'template_version_id',
  type: 'bigint',
  nullable: false,
  comment: 'Template version used to generate the letter',
})
templateVersionId: number;

@Column({
  name: 'letter_number',
  type: 'varchar',
  length: 100,
  unique: true,
  nullable: false,
  comment: 'Unique reference number assigned to the letter',
})
letterNumber: string;

@Column({
  name: 'generated_by',
  type: 'bigint',
  nullable: false,
  comment: 'Employee ID who generated the letter',
})
generatedBy: number;

@Column({
  name: 'generated_at',
  type: 'timestamp',
  nullable: false,
  comment: 'Date and time when the letter was generated',
})
generatedAt: Date;

@Column({
  name: 'effective_date',
  type: 'date',
  nullable: false,
  comment: 'Date from which the letter becomes effective',
})
effectiveDate: Date;

@Column({
  name: 'letter_status_id',
  type: 'bigint',
  nullable: false,
  comment: 'Status ID associated with the generated letter',
})
letterStatusId: number;


  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // TODO(employees): map the FKs to employees(id) once the Employees module exists.
  @Column({
    name: 'created_by',
    type: 'bigint',
    comment: 'Employee ID who created the record',
  })
  createdBy: number;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
    comment: 'Employee ID who last updated the record',
  })
  updatedBy: number | null;
}
