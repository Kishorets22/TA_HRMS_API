
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('document_categories')
export class DocumentCategory {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    comment: 'Primary key ID',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    unique: true,
    comment: 'Name of the document category',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    comment: 'Description of the document category',
  })
  description: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'Indicates whether the document category is active',
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
