
import { HttpStatus } from '@nestjs/common';

import type {
  DepartmentListResponse,
  DepartmentResponse,
  DepartmentDeleteResponse,
} from '../dto/department-response.dto.js';

import type { Department } from '../entities/department.entity.js';

export const DEPARTMENT_RESPONSES = {
  // CREATE
  created: (data: Department): DepartmentResponse => ({
    success: true,
    message: `Department ${data.department_name} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (data: Department[], total: number): DepartmentListResponse => ({
    success: true,
    message:
      total === 0
        ? 'No departments found'
        : 'Departments fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: Department): DepartmentResponse => ({
    success: true,
    message: 'Department fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: Department): DepartmentResponse => ({
    success: true,
    message: `Department ${data.department_name} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE
  deleted: (
    id: number,
    departmentName: string,
  ): DepartmentDeleteResponse => ({
    success: true,
    message: `Department ${departmentName} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: {
      id,
      department_name: departmentName,
    },
  }),

  // NOT FOUND
  notFound: (id: number): DepartmentResponse => ({
    success: false,
    message: `Department with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // COMPANY NOT FOUND
  companyNotFound: (companyId: number): DepartmentResponse => ({
    success: false,
    message: `Company with ID ${companyId} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID DEPARTMENT ID
  invalidId: (id: number): DepartmentResponse => ({
    success: false,
    message: `Invalid department ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // DUPLICATE DEPARTMENT
  duplicate: (): DepartmentResponse => ({
    success: false,
    message: 'Department already exists for this company',
    statusCode: HttpStatus.CONFLICT,
  }),
};
