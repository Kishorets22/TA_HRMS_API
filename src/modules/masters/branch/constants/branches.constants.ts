
import { HttpStatus } from '@nestjs/common';

import type {
  BranchDeleteResponse,
  BranchListResponse,
  BranchResponse,
  BranchResponseDto,
} from '../dto/branch-response.dto.js';

export const BRANCH_RESPONSES = {
  // CREATE
  created: (data: BranchResponseDto): BranchResponse => ({
    success: true,
    message: `Branch ${data.branchName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (data: BranchResponseDto[], total: number): BranchListResponse => ({
    success: true,
    message:
      total === 0
        ? 'No branches found'
        : 'Branches fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: BranchResponseDto): BranchResponse => ({
    success: true,
    message: 'Branch fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: BranchResponseDto): BranchResponse => ({
    success: true,
    message: `Branch ${data.branchName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE
  deleted: (id: number): BranchDeleteResponse => ({
    success: true,
    message: `Branch with ID ${id} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: { id },
  }),

  // NOT FOUND
  notFound: (id: number): BranchResponse => ({
    success: false,
    message: `Branch with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID BRANCH ID
  invalidId: (id: number): BranchResponse => ({
    success: false,
    message: `Invalid branch ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // COMPANY NOT FOUND
  companyNotFound: (companyId: number): BranchResponse => ({
    success: false,
    message: `Company with ID ${companyId} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // DUPLICATE BRANCH
  duplicate: (branchName: string): BranchResponse => ({
    success: false,
    message: `Branch ${branchName} already exists for this company`,
    statusCode: HttpStatus.CONFLICT,
  }),
};
