import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Branch } from '../entities/branch.entity.js';
import type { CreateBranchDto } from '../dto/create-branch.dto.js';
import type { BranchQueryDto } from '../dto/branch-query.dto.js';

@Injectable()
export class BranchesRepository {
  constructor(
    @InjectRepository(Branch)
    private readonly repository: Repository<Branch>,
  ) {}

  // CREATE BRANCH
  async createBranch(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = this.repository.create(createBranchDto);

    return this.repository.save(branch);
  }

  // UPDATE BRANCH
  async updateBranch(branch: Branch): Promise<Branch> {
    return this.repository.save(branch);
  }

  // CHECK BRANCH EXISTS
  branchExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET BRANCH BY ID (call branchExists first; throws when not found)
  getBranchById(id: number): Promise<Branch> {
    return this.repository.findOneByOrFail({ id });
  }

  // CHECK DUPLICATE BRANCH (same company, case-insensitive name).
  // Pass excludeId during update so the branch does not match itself.
  async isDuplicateBranch(
    companyId: number,
    branchName: string,
    excludeId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('branch')
      .where('branch.companyId = :companyId', { companyId })
      .andWhere('LOWER(branch.branchName) = LOWER(:branchName)', {
        branchName,
      });

    if (excludeId) {
      queryBuilder.andWhere('branch.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL BRANCHES WITH FILTERS AND PAGINATION
  async getAllBranch(
    branchQueryDto: BranchQueryDto,
  ): Promise<{ data: Branch[]; total: number }> {
    const page = branchQueryDto.page ?? 1;
    const limit = branchQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('branch');

    // COMPANY FILTER
    if (branchQueryDto.companyId) {
      queryBuilder.andWhere('branch.companyId = :companyId', {
        companyId: branchQueryDto.companyId,
      });
    }

    // ACTIVE STATUS FILTER
    if (typeof branchQueryDto.isActive === 'boolean') {
      queryBuilder.andWhere('branch.isActive = :isActive', {
        isActive: branchQueryDto.isActive,
      });
    }

    // BRANCH NAME SEARCH
    if (branchQueryDto.search?.trim()) {
      queryBuilder.andWhere('branch.branchName ILIKE :search', {
        search: `%${branchQueryDto.search.trim()}%`,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy('branch.createdAt', 'DESC')
      .addOrderBy('branch.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE BRANCH
  async deleteBranch(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return Boolean(result.affected);
  }
}
