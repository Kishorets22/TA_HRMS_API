import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// Mirrors the organizations table in hrms_resolved.sql
@Entity('organizations')
// Named as Postgres names the inline UNIQUE in hrms_resolved.sql
@Unique('organizations_organization_name_key', ['organizationName'])
export class Organization {
  @PrimaryGeneratedColumn('identity', {
    name: 'organization_id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Column({
    name: 'organization_name',
    type: 'varchar',
    length: 255,
  })
  organizationName: string;

  @Column({
    name: 'legal_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  legalName?: string;

  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
  })
  address?: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  email?: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  phone?: string;

  // ACTIVE or INACTIVE; set to ACTIVE on create
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  status?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;
}
