
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmploymentType } from '../entities/employment-type.entity.js';
import type { CreateEmploymentTypeDto } from '../dto/create-employment-type.dto.js';
import type { EmploymentTypeQueryDto } from '../dto/employment-type-query.dto.js';

@Injectable()
export class EmploymentTypesRepository {
  constructor(
    @InjectRepository(EmploymentType)
    private readonly repository: Repository<EmploymentType>,
  ) {}

  // CREATE EMPLOYMENT TYPE
  async createEmploymentType(
    createEmploymentTypeDto: CreateEmploymentTypeDto,
  ): Promise<EmploymentType> {
    const employmentType = this.repository.create(createEmploymentTypeDto);

    return this.repository.save(employmentType);
  }

  // UPDATE EMPLOYMENT TYPE
  async updateEmploymentType(
    employmentType: EmploymentType,
  ): Promise<EmploymentType> {
    return this.repository.save(employmentType);
  }

  // CHECK EMPLOYMENT TYPE EXISTS
  employmentTypeExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET EMPLOYMENT TYPE BY ID (call employmentTypeExists first; throws when not found)
  getEmploymentTypeById(id: number): Promise<EmploymentType> {
    return this.repository.findOneByOrFail({ id });
  }

  // CHECK DUPLICATE EMPLOYMENT TYPE (case-insensitive name).
  // Pass excludeId during update so the employment type does not match itself.
  async isDuplicateEmploymentType(
    employmentTypeName: string,
    excludeId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('employmentType')
      .where(
        'LOWER(employmentType.employmentTypeName) = LOWER(:employmentTypeName)',
        { employmentTypeName },
      );

    if (excludeId) {
      queryBuilder.andWhere('employmentType.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL EMPLOYMENT TYPES WITH FILTERS AND PAGINATION
  async getAllEmploymentType(
    employmentTypeQueryDto: EmploymentTypeQueryDto,
  ): Promise<{ data: EmploymentType[]; total: number }> {
    const page = employmentTypeQueryDto.page ?? 1;
    const limit = employmentTypeQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('employmentType');

    // ACTIVE STATUS FILTER
    if (typeof employmentTypeQueryDto.isActive === 'boolean') {
      queryBuilder.andWhere('employmentType.isActive = :isActive', {
        isActive: employmentTypeQueryDto.isActive,
      });
    }

    // EMPLOYMENT TYPE NAME SEARCH
    if (employmentTypeQueryDto.search?.trim()) {
      queryBuilder.andWhere('employmentType.employmentTypeName ILIKE :search', {
        search: `%${employmentTypeQueryDto.search.trim()}%`,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy('employmentType.id', 'DESC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE EMPLOYMENT TYPE (soft delete: marks it inactive)
  async deleteEmploymentType(id: number): Promise<boolean> {
    const result = await this.repository.update({ id }, { isActive: false });

    return Boolean(result.affected);
  }
}
