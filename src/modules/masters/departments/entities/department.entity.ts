
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity.js';

@Entity('departments')
// DB-level guard against concurrent duplicate inserts; the service also
// checks case-insensitively before writing.
// Unique index, named as in hrms_resolved.sql
@Index(
  'departments_company_id_department_name_key',
  ['company_id', 'department_name'],
  { unique: true },
)
export class Department {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Column({ type: 'bigint' })
  company_id: number;

  @ManyToOne(() => Company, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'fk_departments_company_id_company_company_id',
  })
  company: Company;

  @Column({ type: 'varchar', length: 100 })
  department_name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'bigint', nullable: true })
  created_by?: number;

  @Column({ type: 'bigint', nullable: true })
  updated_by?: number;
}
