import { HttpStatus } from '@nestjs/common';
import type {
  OrganizationDeleteResponse,
  OrganizationListResponse,
  OrganizationResponse,
  OrganizationResponseDto,
} from '../dto/organization-response.dto.js';

export const ORGANIZATION_RESPONSES = {
  // CREATE
  created: (data: OrganizationResponseDto): OrganizationResponse => ({
    success: true,
    message: `Organization ${data.organizationName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (
    data: OrganizationResponseDto[],
    total: number,
  ): OrganizationListResponse => ({
    success: true,
    message:
      total === 0
        ? 'No organizations found'
        : 'Organizations fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: OrganizationResponseDto): OrganizationResponse => ({
    success: true,
    message: 'Organization fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: OrganizationResponseDto): OrganizationResponse => ({
    success: true,
    message: `Organization ${data.organizationName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE (soft delete: the record is marked INACTIVE)
  deleted: (id: number, organizationName: string): OrganizationDeleteResponse => ({
    success: true,
    message: `Organization ${organizationName} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: { id },
  }),

  // NOT FOUND
  notFound: (id: number): OrganizationResponse => ({
    success: false,
    message: `Organization with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // INVALID ORGANIZATION ID
  invalidId: (id: number): OrganizationResponse => ({
    success: false,
    message: `Invalid organization ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // DUPLICATE ORGANIZATION
  duplicate: (name: string): OrganizationResponse => ({
    success: false,
    message: `Organization "${name}" already exists`,
    statusCode: HttpStatus.CONFLICT,
  }),
};
