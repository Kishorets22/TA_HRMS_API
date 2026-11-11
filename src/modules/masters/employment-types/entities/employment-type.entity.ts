import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employment_types' })
// Named as Postgres names the inline UNIQUE in hrms_resolved.sql
@Unique('employment_types_employment_type_name_key', ['employmentTypeName'])
export class EmploymentType {
  // PRIMARY KEY
  @PrimaryGeneratedColumn('identity', {
    type: 'bigint',
    name: 'id',
  })
  id: number;

  // EMPLOYMENT TYPE DETAILS
  // DB-level guard against concurrent duplicate inserts; the service also
  // checks case-insensitively before writing.
  @Column({
    name: 'employment_type_name',
    type: 'varchar',
    length: 50,
  })
  employmentTypeName: string;

  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  description?: string;

  // STATUS
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // AUDIT FIELDS
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

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  createdBy?: number;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
  })
  updatedBy?: number;
}
