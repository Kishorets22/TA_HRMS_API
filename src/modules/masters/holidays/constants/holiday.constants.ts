import { HttpStatus } from '@nestjs/common';

import type {
  HolidayListResponse,
  HolidayResponse,
  HolidayResponseDto,
} from '../dto/holiday-response.dto.js';

// Holiday-specific delete response
export interface HolidayDeleteResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    id: number;
  };
}

export const HOLIDAY_RESPONSES = {
  // CREATE
  created: (data: HolidayResponseDto): HolidayResponse => ({
    success: true,
    message: `Holiday ${data.holidayName} created successfully`,
    statusCode: HttpStatus.CREATED,
    data,
  }),

  // GET ALL
  listed: (
    data: HolidayResponseDto[],
    total: number,
  ): HolidayListResponse => ({
    success: true,
    message:
      data.length === 0
        ? 'No holidays found'
        : 'Holidays fetched successfully',
    statusCode: HttpStatus.OK,
    data,
    total,
  }),

  // GET BY ID
  fetched: (data: HolidayResponseDto): HolidayResponse => ({
    success: true,
    message: 'Holiday fetched successfully',
    statusCode: HttpStatus.OK,
    data,
  }),

  // UPDATE
  updated: (data: HolidayResponseDto): HolidayResponse => ({
    success: true,
    message: `Holiday ${data.holidayName} updated successfully`,
    statusCode: HttpStatus.OK,
    data,
  }),

  // DELETE
  deleted: (id: number): HolidayDeleteResponse => ({
    success: true,
    message: `Holiday with ID ${id} deleted successfully`,
    statusCode: HttpStatus.OK,
    data: { id },
  }),

  // NOT FOUND
  notFound: (id: number): HolidayResponse => ({
    success: false,
    message: `Holiday with ID ${id} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // COMPANY NOT FOUND
  companyNotFound: (companyId: number): HolidayResponse => ({
    success: false,
    message: `Company with ID ${companyId} not found`,
    statusCode: HttpStatus.NOT_FOUND,
  }),

  // DUPLICATE HOLIDAY
  duplicate: (): HolidayResponse => ({
    success: false,
    message: 'Holiday already exists for this company',
    statusCode: HttpStatus.CONFLICT,
  }),

  // INTERNAL SERVER ERROR
  internalError: (action: string): HolidayResponse => ({
    success: false,
    message: `An error occurred while ${action} the holiday`,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  }),

  // INVALID HOLIDAY ID
  invalidId: (id: number): HolidayResponse => ({
    success: false,
    message: `Invalid holiday ID: ${id}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // INVALID HOLIDAY DATE
  invalidDate: (date: string): HolidayResponse => ({
    success: false,
    message: `Invalid holiday date: ${date}`,
    statusCode: HttpStatus.BAD_REQUEST,
  }),

  // INVALID DATE RANGE
  invalidDateRange: (): HolidayResponse => ({
    success: false,
    message: 'From date cannot be later than to date',
    statusCode: HttpStatus.BAD_REQUEST,
  }),
};