import { HttpStatus } from '@nestjs/common';
import type {
  CompanyListResponse,
  CompanyResponse,
  CompanyResponseDto,
} from '../dto/company-response.dto.js';
import type { DeleteResponseDto } from '../../../../common/dto/generics/delete-response.dto.js';

export const COMPANY_RESPONSES = {
  created: (data: CompanyResponseDto): CompanyResponse => ({
    success: true,
    message: `Company ${data.companyName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  listed: (data: CompanyResponseDto[], total: number): CompanyListResponse => ({
    success: true,
    message:
      data.length === 0
        ? 'No companies found'
        : 'Companies fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  fetched: (data: CompanyResponseDto): CompanyResponse => ({
    success: true,
    message: 'Company fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  updated: (data: CompanyResponseDto): CompanyResponse => ({
    success: true,
    message: `Company ${data.companyName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  deleted: (id: number, companyName: string): DeleteResponseDto => ({
    success: true,
    message: `Company ${companyName} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: { id },
  }),

  notFound: (id: number): CompanyResponse => ({
    success: false,
    message: `Company with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  organizationNotFound: (organizationId: number): CompanyResponse => ({
    success: false,
    message: `Organization with ID ${organizationId} not found`,
    statusCode: HttpStatus.NOT_FOUND,
    data: null,
  }),

  internalError: (action: string): CompanyResponse => ({
    success: false,
    message: `An error occurred while ${action} the company`,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    data: null,
  }),
};