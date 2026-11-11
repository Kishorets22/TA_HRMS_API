
import { HttpStatus } from '@nestjs/common';

import type { Employee } from '../entities/employee.entity.js';

// Employee field limits
export const EMPLOYEE_LIMITS = {
  EMPLOYEE_ID_MAX_LENGTH: 20,
  FIRST_NAME_MAX_LENGTH: 100,
  LAST_NAME_MAX_LENGTH: 100,
  WORK_EMAIL_MAX_LENGTH: 150,
  GENDER_MAX_LENGTH: 30,
  PROFILE_PHOTO_URL_MAX_LENGTH: 500,
  PHONE_NUMBER_MAX_LENGTH: 20,
  PERSONAL_EMAIL_MAX_LENGTH: 150,
  EMERGENCY_CONTACT_NAME_MAX_LENGTH: 150,
} as const;

// Employee API responses
export const EMPLOYEE_RESPONSES = {
  // Success responses
  created: (data: Employee) => ({
    success: true,
    message: `Employee ${data.firstName} ${data.lastName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  listed: (data: Employee[], total: number) => ({
    success: true,
    message:
      total === 0
        ? 'No employees found'
        : 'Employees fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  fetched: (data: Employee) => ({
    success: true,
    message: 'Employee fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  updated: (data: Employee) => ({
    success: true,
    message: `Employee ${data.firstName} ${data.lastName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  deleted: (data: Employee) => ({
    success: true,
    message: `Employee ${data.firstName} ${data.lastName} deleted successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // Validation and error responses
  invalidDateRange: () => ({
    success: false,
    message: 'Date of exit cannot be earlier than date of joining',
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  duplicate: () => ({
    success: false,
    message: 'Employee already exists',
    statusCode: HttpStatus.CONFLICT,
  }),

  duplicateEmployeeId: () => ({
    success: false,
    message: 'Employee ID already exists',
    statusCode: HttpStatus.CONFLICT,
  }),

  invalidId: (id: string) => ({
    success: false,
    message: `Invalid employee ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  notFound: (id: string) => ({
    success: false,
    message: `Employee with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),
};

// Single employee response interface
export interface EmployeeResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data?: Employee;
}

// Employee list response interface
export interface EmployeeListResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Employee[];
  total: number;
}
