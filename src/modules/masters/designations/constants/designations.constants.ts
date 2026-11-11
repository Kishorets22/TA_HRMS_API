
import { HttpStatus } from '@nestjs/common';

import type {
  DesignationDeleteResponse,
  DesignationListResponse,
  DesignationResponse,
} from '../dto/designation-response.dto.js';

import type { Designation } from '../entities/designation.entity.js';

export const DESIGNATION_RESPONSES = {
  // CREATE
  created: (data: Designation): DesignationResponse => ({
    success: true,
    message: `Designation ${data.designationName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (data: Designation[], total: number): DesignationListResponse => ({
    success: true,
    message:
      total === 0
        ? 'No designations found'
        : 'Designations fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: Designation): DesignationResponse => ({
    success: true,
    message: 'Designation fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: Designation): DesignationResponse => ({
    success: true,
    message: `Designation ${data.designationName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE
  deleted: (
    id: number,
    designationName: string,
  ): DesignationDeleteResponse => ({
    success: true,
    message: `Designation ${designationName} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: {
      id,
      designationName,
    },
  }),

  // DUPLICATE DESIGNATION
  duplicate: (name: string): DesignationResponse => ({
    success: false,
    message: `Designation "${name}" already exists`,
    statusCode: HttpStatus.CONFLICT,
  }),

  // NOT FOUND
  notFound: (id: number): DesignationResponse => ({
    success: false,
    message: `Designation with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID DESIGNATION ID
  invalidId: (id: number): DesignationResponse => ({
    success: false,
    message: `Invalid designation ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),
};
