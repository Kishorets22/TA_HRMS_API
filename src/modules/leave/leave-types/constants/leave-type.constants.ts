import { HttpStatus } from '@nestjs/common';
import type { LeaveType } from '../entities/leave-type.entity.js';
import type {
  LeaveTypeDeleteResponse,
  LeaveTypeListResponse,
  LeaveTypeResponse,
  LeaveTypeResponseDto,
} from '../dto/leave-type-response.dto.js';

// Maps the entity to the response shape; empty values are left out.
const toLeaveTypeResponseDto = (leaveType: LeaveType): LeaveTypeResponseDto => ({
  id: leaveType.id,
  code: leaveType.code,
  name: leaveType.name,
  unit: leaveType.unit,
  isActive: leaveType.isActive,
  isCompensatory: leaveType.isCompensatory,
  maxCarryForwardDays: leaveType.maxCarryForwardDays ?? undefined,
  createdBy: leaveType.createdBy ?? undefined,
  updatedBy: leaveType.updatedBy ?? undefined,
  createdAt: leaveType.createdAt,
  updatedAt: leaveType.updatedAt,
});

export const LEAVE_TYPE_RESPONSES = {
  // Create leave type
  created: (data: LeaveType): LeaveTypeResponse => ({
    success: true,
    message: 'Leave type created successfully',
    statusCode: HttpStatus.CREATED,
    data: toLeaveTypeResponseDto(data),
  }),

  // Retrieve all leave types
  listed: (data: LeaveType[], total: number): LeaveTypeListResponse => ({
    success: true,
    message: 'Leave types retrieved successfully',
    statusCode: HttpStatus.OK,
    data: data.map(toLeaveTypeResponseDto),
    total,
  }),

  // Retrieve leave type by ID
  fetched: (data: LeaveType): LeaveTypeResponse => ({
    success: true,
    message: 'Leave type retrieved successfully',
    statusCode: HttpStatus.OK,
    data: toLeaveTypeResponseDto(data),
  }),

  // Update leave type
  updated: (data: LeaveType): LeaveTypeResponse => ({
    success: true,
    message: 'Leave type updated successfully',
    statusCode: HttpStatus.OK,
    data: toLeaveTypeResponseDto(data),
  }),

  // Update leave type status
  statusUpdated: (data: LeaveType): LeaveTypeResponse => ({
    success: true,
    message: 'Leave type status updated successfully',
    statusCode: HttpStatus.OK,
    data: toLeaveTypeResponseDto(data),
  }),

  // Delete leave type
  deleted: (id: number): LeaveTypeDeleteResponse => ({
    success: true,
    message: `Leave type ${id} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: { id },
  }),

  // Leave type not found
  notFound: (id: number): LeaveTypeResponse => ({
    success: false,
    message: `Leave type ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // Duplicate leave type code
  duplicateCode: (): LeaveTypeResponse => ({
    success: false,
    message: 'A leave type with this code already exists',
    statusCode: HttpStatus.CONFLICT,
  }),

  // Invalid leave type ID
  invalidId: (id: number): LeaveTypeResponse => ({
    success: false,
    message: `Invalid leave type ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // Invalid carry-forward days
  invalidCarryForward: (): LeaveTypeResponse => ({
    success: false,
    message: 'Maximum carry-forward days must be between 0 and 9999.99',
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // Invalid leave unit
  invalidUnit: (): LeaveTypeResponse => ({
    success: false,
    message: 'Leave unit must be DAYS or HOURS',
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // Empty update request
  emptyUpdate: (): LeaveTypeResponse => ({
    success: false,
    message: 'At least one field is required for update',
    statusCode: HttpStatus.BAD_REQUEST,
  }),
};