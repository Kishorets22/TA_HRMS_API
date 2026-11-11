
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity.js';

// Mirrors hrms_resolved.sql. Duplicates (same company, date, name) are
// prevented by the service's case-insensitive check.
@Entity('holidays')
export class Holiday {
  // Primary Key
  @PrimaryGeneratedColumn('identity', {
    name: 'holiday_id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  // Foreign Key Column
  @Column({
    name: 'company_id',
    type: 'bigint',
  })
  companyId: number;

  // Company Relationship
  @ManyToOne(
    () => Company,
    {
      nullable: false,
      onDelete: 'NO ACTION',
    },
  )
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_holidays_company_id_company_company_id',
  })
  company: Company;

  // Holiday Name
  @Column({
    name: 'holiday_name',
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  holidayName: string;

  // Holiday Date
  @Column({
    name: 'holiday_date',
    type: 'date',
    nullable: false,
  })
  holidayDate: string;

  // Holiday Type
  @Column({
    name: 'holiday_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  holidayType?: string;

  // Created Timestamp
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  // Updated Timestamp
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
