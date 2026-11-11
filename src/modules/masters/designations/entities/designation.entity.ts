
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Department } from '../../departments/entities/department.entity.js';

@Entity('designations')
export class Designation {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Column({ name: 'department_id', type: 'bigint' })
  departmentId: number;

  @ManyToOne(() => Department, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department: Department;

  @Column({ name: 'designation_name', type: 'varchar', length: 100 })
  designationName: string;

  @Column({ name: 'level_id', type: 'bigint' })
  levelId: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'bigint', nullable: true })
  createdBy?: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedBy?: number;
}
