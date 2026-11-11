
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Company } from '../../companies/entities/company.entity.js';
import { Department } from '../../departments/entities/department.entity.js';
import { Designation } from '../../designations/entities/designation.entity.js';
import { Branch } from '../../branch/entities/branch.entity.js';
import { EmploymentType } from '../../employment-types/entities/employment-type.entity.js';

@Entity('employees')
@Check(
  'chk_exit_date',
  '"date_of_exit" IS NULL OR "date_of_exit" >= "date_of_joining"',
)
export class Employee {
  // Primary Key
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'bigint',
  })
  id!: string;

  // Company Details
  @Column({
    name: 'company_id',
    type: 'bigint',
  })
  companyId!: string;

  @ManyToOne(() => Company, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'company_id',
    referencedColumnName: 'id',
  })
  company!: Company;

  // Employee Information
  @Column({
    name: 'employee_id',
    type: 'varchar',
    length: 20,
    unique: true,
  })
  employeeId!: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 100,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 100,
  })
  lastName!: string;

  @Column({
    name: 'date_of_birth',
    type: 'date',
    nullable: true,
  })
  dateOfBirth!: string;

  @Column({
    name: 'gender',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  gender!: string;

  @Column({
    name: 'profile_photo_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profilePhotoUrl!: string;

  // Contact Information
  @Column({
    name: 'work_email',
    type: 'varchar',
    length: 150,
    unique: true,
  })
  workEmail!: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
  })
  phoneNumber!: string;

  @Column({
    name: 'personal_email',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  personalEmail!: string;

  @Column({
    name: 'current_address',
    type: 'text',
    nullable: true,
  })
  currentAddress!: string;

  @Column({
    name: 'permanent_address',
    type: 'text',
    nullable: true,
  })
  permanentAddress!: string;

  // Emergency Contact
  @Column({
    name: 'emergency_contact_name',
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  emergencyContactName!: string;

  @Column({
    name: 'emergency_contact_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  emergencyContactPhone!: string;

  // Employment Information
  @Column({
    name: 'date_of_joining',
    type: 'date',
  })
  dateOfJoining!: string;

  // Department Relationship
  @Column({
    name: 'department_id',
    type: 'bigint',
  })
  departmentId!: string;

  @ManyToOne(() => Department, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'department_id',
    referencedColumnName: 'id',
  })
  department!: Department;

  // Designation Relationship
  @Column({
    name: 'designation_id',
    type: 'bigint',
  })
  designationId!: string;

  @ManyToOne(() => Designation, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'designation_id',
    referencedColumnName: 'id',
  })
  designation!: Designation;

  // Branch Relationship
  @Column({
    name: 'branch_id',
    type: 'bigint',
    nullable: true,
  })
  branchId!: string;

  @ManyToOne(() => Branch, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'branch_id',
    referencedColumnName: 'id',
  })
  branch!: Branch;

  // Reporting Manager - Self Relationship
  @Column({
    name: 'reporting_manager_id',
    type: 'bigint',
    nullable: true,
  })
  reportingManagerId!: string;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'reporting_manager_id',
    referencedColumnName: 'id',
  })
  reportingManager!: Employee;

  // Employment Type Relationship
  @Column({
    name: 'employment_type_id',
    type: 'bigint',
  })
  employmentTypeId!: string;

  @ManyToOne(() => EmploymentType, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'employment_type_id',
    referencedColumnName: 'id',
  })
  employmentType!: EmploymentType;

  // Employment Status
  @Column({
    name: 'employee_status',
    type: 'boolean',
    default: true,
  })
  employeeStatus!: boolean;

  @Column({
    name: 'probation_end_date',
    type: 'date',
    nullable: true,
  })
  probationEndDate!: string;

  @Column({
    name: 'date_of_exit',
    type: 'date',
    nullable: true,
  })
  dateOfExit!: string;

  // Audit Information
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  // Created By - Self Relationship
  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  createdBy!: string;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'created_by',
    referencedColumnName: 'id',
  })
  createdByEmployee!: Employee;

  // Updated By - Self Relationship
  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
  })
  updatedBy!: string;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'updated_by',
    referencedColumnName: 'id',
  })
  updatedByEmployee!: Employee;
}
