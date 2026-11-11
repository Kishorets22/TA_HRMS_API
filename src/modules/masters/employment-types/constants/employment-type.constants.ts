import { HttpStatus } from '@nestjs/common';

import type {
  EmploymentTypeListResponse,
  EmploymentTypeResponse,
  EmploymentTypeResponseDto,
} from '../dto/employment-type-response.dto.js';

export const EMPLOYMENT_TYPE_LIMITS = {
  NAME_MAX_LENGTH: 50,
} as const;

export const EMPLOYMENT_TYPE_RESPONSES = {
  // CREATE
  created: (data: EmploymentTypeResponseDto): EmploymentTypeResponse => ({
    success: true,
    message: `Employment type ${data.employmentTypeName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (
    data: EmploymentTypeResponseDto[],
    total: number,
  ): EmploymentTypeListResponse => ({
    success: true,
    message:
      total === 0
        ? 'No employment types found'
        : 'Employment types fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: EmploymentTypeResponseDto): EmploymentTypeResponse => ({
    success: true,
    message: 'Employment type fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: EmploymentTypeResponseDto): EmploymentTypeResponse => ({
    success: true,
    message: `Employment type ${data.employmentTypeName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE (soft delete: the record is deactivated, not removed)
  deleted: (data: EmploymentTypeResponseDto): EmploymentTypeResponse => ({
    success: true,
    message: `Employment type ${data.employmentTypeName} deactivated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // NOT FOUND
  notFound: (id: number): EmploymentTypeResponse => ({
    success: false,
    message: `Employment type with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID EMPLOYMENT TYPE ID
  invalidId: (id: number): EmploymentTypeResponse => ({
    success: false,
    message: `Invalid employment type ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // DUPLICATE EMPLOYMENT TYPE
  duplicate: (): EmploymentTypeResponse => ({
    success: false,
    message: 'Employment type already exists',
    statusCode: HttpStatus.CONFLICT,
  }),
};
