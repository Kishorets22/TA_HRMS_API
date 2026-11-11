
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';

import { LeaveType } from '../entities/leave-type.entity.js';
import type { CreateLeaveTypeDto } from '../dto/create-leave-type.dto.js';
import type { LeaveTypeQueryDto } from '../dto/leave-type-query.dto.js';

import { formatCarryForwardDays } from '../utils/leave-type-validation.utils.js';

@Injectable()
export class LeaveTypeRepository {
  constructor(
    @InjectRepository(LeaveType)
    private readonly repository: Repository<LeaveType>,
  ) {}

  // CREATE LEAVE TYPE
  async createLeaveType(
    createLeaveTypeDto: CreateLeaveTypeDto,
  ): Promise<LeaveType> {
    const leaveType = this.repository.create({
      ...createLeaveTypeDto,
      maxCarryForwardDays: formatCarryForwardDays(
        createLeaveTypeDto.maxCarryForwardDays,
      ),
      isActive: true,
    });

    return this.repository.save(leaveType);
  }

  // UPDATE LEAVE TYPE
  async updateLeaveType(leaveType: LeaveType): Promise<LeaveType> {
    return this.repository.save(leaveType);
  }

  // CHECK LEAVE TYPE EXISTS
  leaveTypeExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET LEAVE TYPE BY ID (call leaveTypeExists first; throws when not found)
  async getLeaveTypeById(id: number): Promise<LeaveType> {
    try {
      return await this.repository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(
          `Leave type ${id} not found`,
        );
      }

      throw error;
    }
  }

  // CHECK DUPLICATE LEAVE TYPE CODE (case-insensitive).
  // Pass excludeId during update so the leave type does not match itself.
  async isDuplicateCode(code: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('leaveType')
      .where('LOWER(leaveType.code) = LOWER(:code)', { code });

    if (excludeId) {
      queryBuilder.andWhere('leaveType.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL LEAVE TYPES WITH FILTERS AND PAGINATION
  async getAllLeaveTypes(
    leaveTypeQueryDto: LeaveTypeQueryDto,
  ): Promise<{ data: LeaveType[]; total: number }> {
    const page = leaveTypeQueryDto.page ?? 1;
    const limit = leaveTypeQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;
    const sortBy = leaveTypeQueryDto.sortBy ?? 'createdAt';
    const sortOrder = leaveTypeQueryDto.sortOrder ?? 'DESC';

    const allowedSortFields = {
      createdAt: 'leaveType.createdAt',
      updatedAt: 'leaveType.updatedAt',
      name: 'leaveType.name',
      code: 'leaveType.code',
    };

    const queryBuilder = this.repository.createQueryBuilder('leaveType');

    // NAME OR CODE SEARCH
    if (leaveTypeQueryDto.search?.trim()) {
      queryBuilder.andWhere(
        '(leaveType.name ILIKE :search OR leaveType.code ILIKE :search)',
        { search: `%${leaveTypeQueryDto.search.trim()}%` },
      );
    }

    // ACTIVE STATUS FILTER
    if (typeof leaveTypeQueryDto.isActive === 'boolean') {
      queryBuilder.andWhere('leaveType.isActive = :isActive', {
        isActive: leaveTypeQueryDto.isActive,
      });
    }

    // UNIT FILTER
    if (leaveTypeQueryDto.unit) {
      queryBuilder.andWhere('leaveType.unit = :unit', {
        unit: leaveTypeQueryDto.unit,
      });
    }

    // COMPENSATORY FILTER
    if (typeof leaveTypeQueryDto.isCompensatory === 'boolean') {
      queryBuilder.andWhere('leaveType.isCompensatory = :isCompensatory', {
        isCompensatory: leaveTypeQueryDto.isCompensatory,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy(allowedSortFields[sortBy], sortOrder)
      .addOrderBy('leaveType.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE LEAVE TYPE
  async deleteLeaveType(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return Boolean(result.affected);
  }
}
