
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Designation } from '../entities/designation.entity.js';
import type { CreateDesignationDto } from '../dto/create-designation.dto.js';
import type { DesignationQueryDto } from '../dto/designation-query.dto.js';

@Injectable()
export class DesignationsRepository {
  constructor(
    @InjectRepository(Designation)
    private readonly repository: Repository<Designation>,
  ) { }

  async createDesignation(
    createDesignationDto: CreateDesignationDto,
  ): Promise<Designation> {
    const designation = this.repository.create(createDesignationDto);
    return this.repository.save(designation);
  }

  async updateDesignation(
    designation: Designation,
  ): Promise<Designation> {
    return this.repository.save(designation);
  }

  designationExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }
  designationExistsByName(designationName: string, departmentId: number,): Promise<boolean> {
    return this.repository.existsBy({ designationName });
  }

  getDesignationById(id: number): Promise<Designation> {
    return this.repository.findOneByOrFail({ id });
  }

  async getAllDesignations(
    designationQueryDto: DesignationQueryDto,
  ): Promise<{ data: Designation[]; total: number }> {
    const page = designationQueryDto.page ?? 1;
    const limit = designationQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('designation');

    if (designationQueryDto.search?.trim()) {
      queryBuilder.andWhere(
        'designation.designationName ILIKE :search',
        {
          search: `%${designationQueryDto.search.trim()}%`,
        },
      );
    }

    queryBuilder
      .orderBy('designation.createdAt', 'DESC')
      .addOrderBy('designation.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  async deleteDesignation(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return Boolean(result.affected);
  }
}
