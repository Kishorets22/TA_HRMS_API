
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DocumentCategory } from './document-category.entity.js';

@Entity('document_types')
export class DocumentType {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    comment: 'Primary key ID',
  })
  id: number;

  @Column({
    name: 'category_id',
    type: 'bigint',
    comment: 'Category this document type belongs to',
  })
  categoryId: number;

  @ManyToOne(() => DocumentCategory, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'category_id',
    foreignKeyConstraintName:
      'fk_document_types_category_id_document_categories_id',
  })
  category: DocumentCategory;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    comment: 'Name of the document type',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    comment: 'Description of the document type',
  })
  description: string;

  @Column({
    name: 'has_expiry',
    type: 'boolean',
    default: false,
    comment: 'Indicates whether the document type has an expiry date',
  })
  hasExpiry: boolean;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'Indicates whether the document type is active',
  })
  isActive: boolean;

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
    comment: 'Employee ID who last updated the record',
  })
  updatedBy: number;
}
