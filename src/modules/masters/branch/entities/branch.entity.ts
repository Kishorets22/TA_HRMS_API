import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity.js';

// Mirrors the branches table in hrms_resolved.sql
@Entity({ name: 'branches' })
// Unique index, named as in hrms_resolved.sql
@Index('branches_company_id_branch_name_key', ['companyId', 'branchName'], {
  unique: true,
})
export class Branch {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Column({ name: 'company_id', type: 'bigint' })
  companyId: number;

  @ManyToOne(() => Company, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_branches_company_id_company_company_id',
  })
  company: Company;

  @Column({ name: 'branch_name', type: 'varchar', length: 100 })
  branchName: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
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
  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy?: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number;
}