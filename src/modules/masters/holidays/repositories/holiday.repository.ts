import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Holiday } from '../entities/holiday.entity.js';
import type { CreateHolidayDto } from '../dto/create-holiday.dto.js';
import type { HolidayQueryDto } from '../dto/holiday-query.dto.js';

@Injectable()
export class HolidayRepository {
  constructor(
    @InjectRepository(Holiday)
    private readonly repository: Repository<Holiday>,
  ) {}

  // CREATE HOLIDAY
  async createHoliday(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    const holiday = this.repository.create(createHolidayDto);

    return this.repository.save(holiday);
  }

  // UPDATE HOLIDAY
  async updateHoliday(holiday: Holiday): Promise<Holiday> {
    return this.repository.save(holiday);
  }

  // CHECK HOLIDAY EXISTS
  holidayExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET HOLIDAY BY ID (call holidayExists first; throws when not found)
  getHolidayById(id: number): Promise<Holiday> {
    return this.repository.findOneByOrFail({ id });
  }

  // CHECK DUPLICATE HOLIDAY (same company, date and case-insensitive name).
  // Pass excludeId during update so the holiday does not match itself.
  async isDuplicateHoliday(
    companyId: number,
    holidayDate: string,
    holidayName: string,
    excludeId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('holiday')
      .where('holiday.companyId = :companyId', { companyId })
      .andWhere('holiday.holidayDate = :holidayDate', { holidayDate })
      .andWhere('LOWER(holiday.holidayName) = LOWER(:holidayName)', {
        holidayName,
      });

    if (excludeId) {
      queryBuilder.andWhere('holiday.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL HOLIDAYS WITH FILTERS AND PAGINATION
  async getAllHoliday(
    holidayQueryDto: HolidayQueryDto,
  ): Promise<{ data: Holiday[]; total: number }> {
    const page = holidayQueryDto.page ?? 1;
    const limit = holidayQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('holiday');

    // COMPANY FILTER
    if (holidayQueryDto.companyId) {
      queryBuilder.andWhere('holiday.companyId = :companyId', {
        companyId: holidayQueryDto.companyId,
      });
    }

    // HOLIDAY NAME SEARCH
    if (holidayQueryDto.search?.trim()) {
      queryBuilder.andWhere('holiday.holidayName ILIKE :search', {
        search: `%${holidayQueryDto.search.trim()}%`,
      });
    }

    // FROM DATE FILTER
    if (holidayQueryDto.fromDate) {
      queryBuilder.andWhere('holiday.holidayDate >= :fromDate', {
        fromDate: holidayQueryDto.fromDate,
      });
    }

    // TO DATE FILTER
    if (holidayQueryDto.toDate) {
      queryBuilder.andWhere('holiday.holidayDate <= :toDate', {
        toDate: holidayQueryDto.toDate,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy('holiday.holidayDate', 'ASC')
      .addOrderBy('holiday.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE HOLIDAY
  async deleteHoliday(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return Boolean(result.affected);
  }
}
