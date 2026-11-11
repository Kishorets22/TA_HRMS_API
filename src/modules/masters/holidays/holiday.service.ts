import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { HolidayRepository } from './repositories/holiday.repository.js';
import { CompanyRepository } from '../companies/repositories/company.repository.js';
import type { CreateHolidayDto } from './dto/create-holiday.dto.js';
import type { UpdateHolidayDto } from './dto/update-holiday.dto.js';
import type { HolidayQueryDto } from './dto/holiday-query.dto.js';

import type {
  HolidayResponse,
  HolidayListResponse,
} from './dto/holiday-response.dto.js';

import {
  HOLIDAY_RESPONSES,
  type HolidayDeleteResponse,
} from './constants/holiday.constants.js';

import {
  isValidHolidayDate,
  isValidHolidayId,
} from './utils/holiday-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class HolidayService {
  private readonly logger = new Logger(HolidayService.name);

  constructor(
    private readonly holidayRepository: HolidayRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async createHoliday(createHolidayDto: CreateHolidayDto): Promise<HolidayResponse> {
    this.logger.log(
      `[HOLIDAY] Creating "${createHolidayDto.holidayName}" on ${createHolidayDto.holidayDate} for company ${createHolidayDto.companyId}`,
    );
    try {
      if (!isValidHolidayDate(createHolidayDto.holidayDate)) {
        return HOLIDAY_RESPONSES.invalidDate(createHolidayDto.holidayDate);
      }

      const company = await this.companyRepository.findCompanyById(
        createHolidayDto.companyId,
      );
      if (!company) {
        this.logger.warn(`[HOLIDAY] Company ${createHolidayDto.companyId} not found`);
        return HOLIDAY_RESPONSES.companyNotFound(createHolidayDto.companyId);
      }

      const duplicate = await this.holidayRepository.isDuplicateHoliday(
        createHolidayDto.companyId,
        createHolidayDto.holidayDate,
        createHolidayDto.holidayName,
      );
      if (duplicate) {
        this.logger.warn(`[HOLIDAY] Duplicate holiday "${createHolidayDto.holidayName}"`);
        return HOLIDAY_RESPONSES.duplicate();
      }

      const saved = await this.holidayRepository.createHoliday(createHolidayDto);
      this.logger.log(`[HOLIDAY] Holiday created with ID ${saved.id}`);

      return HOLIDAY_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[HOLIDAY] An error occurred while creating the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retrievingAllHolidays(
    holidayQueryDto: HolidayQueryDto,
  ): Promise<HolidayListResponse | HolidayResponse> {
    this.logger.log(
      `[HOLIDAY] Fetching holidays (page=${holidayQueryDto.page ?? 1}, limit=${holidayQueryDto.limit ?? 10}, companyId=${holidayQueryDto.companyId ?? 'ALL'}, from=${holidayQueryDto.fromDate ?? '-'}, to=${holidayQueryDto.toDate ?? '-'})`,
    );
    try {
      if (holidayQueryDto.fromDate && !isValidHolidayDate(holidayQueryDto.fromDate)) {
        return HOLIDAY_RESPONSES.invalidDate(holidayQueryDto.fromDate);
      }
      if (holidayQueryDto.toDate && !isValidHolidayDate(holidayQueryDto.toDate)) {
        return HOLIDAY_RESPONSES.invalidDate(holidayQueryDto.toDate);
      }
      if (holidayQueryDto.fromDate && holidayQueryDto.toDate && holidayQueryDto.fromDate > holidayQueryDto.toDate) {
        return HOLIDAY_RESPONSES.invalidDateRange();
      }

      const { data, total } =
        await this.holidayRepository.getAllHoliday(holidayQueryDto);
      this.logger.log(
        `[HOLIDAY] Returned ${data.length} of ${total} matching holidays`,
      );

      return HOLIDAY_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[HOLIDAY] An error occurred while retrieving all Holidays: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Holidays',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async retrievingHolidayById(id: number): Promise<HolidayResponse> {
    try {
      if (!isValidHolidayId(id)) {
        return HOLIDAY_RESPONSES.invalidId(id);
      }

      const exists = await this.holidayRepository.holidayExists(id);
      if (!exists) {
        this.logger.warn(`[HOLIDAY] Holiday ${id} not found`);
        return HOLIDAY_RESPONSES.notFound(id);
      }

      const holiday = await this.holidayRepository.getHolidayById(id);

      return HOLIDAY_RESPONSES.fetched(holiday);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[HOLIDAY] An error occurred while retrieving the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateHoliday(
    id: number,
    updateHolidayDto: UpdateHolidayDto,
  ): Promise<HolidayResponse> {
    try {
      if (!isValidHolidayId(id)) {
        return HOLIDAY_RESPONSES.invalidId(id);
      }

      const exists = await this.holidayRepository.holidayExists(id);
      if (!exists) {
        this.logger.warn(`[HOLIDAY] Holiday ${id} not found`);
        return HOLIDAY_RESPONSES.notFound(id);
      }

      if (updateHolidayDto.holidayDate && !isValidHolidayDate(updateHolidayDto.holidayDate)) {
        return HOLIDAY_RESPONSES.invalidDate(updateHolidayDto.holidayDate);
      }

      const holiday = await this.holidayRepository.getHolidayById(id);

      const holidayName = updateHolidayDto.holidayName ?? holiday.holidayName;
      const holidayDate = updateHolidayDto.holidayDate ?? holiday.holidayDate;

      const duplicate = await this.holidayRepository.isDuplicateHoliday(
        holiday.companyId,
        holidayDate,
        holidayName,
        holiday.id,
      );
      if (duplicate) {
        this.logger.warn(`[HOLIDAY] Duplicate holiday "${holidayName}"`);
        return HOLIDAY_RESPONSES.duplicate();
      }

      // Assign only the editable fields, never the raw request body.
      holiday.holidayName = holidayName;
      holiday.holidayDate = holidayDate;
      holiday.holidayType = updateHolidayDto.holidayType ?? holiday.holidayType;

      const updated = await this.holidayRepository.updateHoliday(holiday);
      this.logger.log(`[HOLIDAY] Holiday ${id} updated`);

      return HOLIDAY_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[HOLIDAY] An error occurred while updating the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteHoliday(
    id: number,
  ): Promise<HolidayDeleteResponse | HolidayResponse> {
    try {
      if (!isValidHolidayId(id)) {
        return HOLIDAY_RESPONSES.invalidId(id);
      }

      const deleted = await this.holidayRepository.deleteHoliday(id);
      if (!deleted) {
        this.logger.warn(`[HOLIDAY] Holiday ${id} not found`);
        return HOLIDAY_RESPONSES.notFound(id);
      }

      this.logger.log(`[HOLIDAY] Holiday ${id} deleted`);

      return HOLIDAY_RESPONSES.deleted(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[HOLIDAY] An error occurred while deleting the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
