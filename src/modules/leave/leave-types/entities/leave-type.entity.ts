import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Supported leave calculation units
export type LeaveUnit = 'DAYS' | 'HOURS';

// Mirrors the leave_types table
@Entity('leave_types')
@Check('chk_leave_types_unit', `"unit" IN ('DAYS', 'HOURS')`)
export class LeaveType {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    type: 'bigint',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    name: 'unit',
    type: 'varchar',
    length: 10,
    default: 'DAYS',
  })
  unit: LeaveUnit;

  // Set to true on create
  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    name: 'is_compensatory',
    type: 'boolean',
    default: false,
  })
  isCompensatory: boolean;

  @Column({
    name: 'max_carry_forward_days',
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
  })
  maxCarryForwardDays?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({
    name: 'created_by',
    type: 'bigint',
    nullable: true,
  })
  createdBy?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column({
    name: 'updated_by',
    type: 'bigint',
    nullable: true,
  })
  updatedBy?: number;
}