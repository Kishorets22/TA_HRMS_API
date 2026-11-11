import {
  Column,
  CreateDateColumn,
  Entity,
  //Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity.js';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('identity', {
    name: 'company_id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
    comment: 'Primary key ID',
  })
  id: number;

  @Column({
    name: 'organization_id',
    type: 'bigint',
    comment: 'Organization this company belongs to',
  })
  organizationId: number;

  @ManyToOne(() => Organization, { nullable: false, onDelete: 'NO ACTION' })
  @JoinColumn({
    name: 'organization_id',
    foreignKeyConstraintName: 'fk_company_organization_id_organizations_organization_id',
  })
  organization: Organization;

  @Column({
    name: 'company_name',
    type: 'varchar',
    length: 150,
    comment: 'Name of the company',
  })
  companyName: string;

  @Column({
    name: 'legal_name',
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Legal registered name',
  })
  legalName: string | null;

  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
    comment: 'Physical or registered address',
  })
  address: string | null;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    nullable: true,
    comment: 'Contact email address',
  })
  email: string | null;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Contact phone number',
  })
  phone: string | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'ACTIVE',
    comment: 'Status: ACTIVE or INACTIVE',
  })
  status: string;

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
}