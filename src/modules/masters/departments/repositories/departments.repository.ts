
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from '../entities/department.entity.js';
import type { CreateDepartmentDto } from '../dto/create-department.dto.js';
import type { DepartmentQueryDto } from '../dto/department-query.dto.js';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repository: Repository<Department>,
  ) {}

  // CREATE DEPARTMENT
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const department = this.repository.create(createDepartmentDto);

    return this.repository.save(department);
  }

  // UPDATE DEPARTMENT
  async updateDepartment(department: Department): Promise<Department> {
    return this.repository.save(department);
  }

  // CHECK DEPARTMENT EXISTS
  departmentExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET DEPARTMENT BY ID (call departmentExists first; throws when not found)
  getDepartmentById(id: number): Promise<Department> {
    return this.repository.findOneByOrFail({ id });
  }

  // CHECK DUPLICATE DEPARTMENT (same company, case-insensitive name).
  // Pass excludeId during update so the department does not match itself.
  async isDuplicateDepartment(
    companyId: number,
    departmentName: string,
    excludeId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('department')
      .where('department.company_id = :companyId', { companyId })
      .andWhere(
        'LOWER(department.department_name) = LOWER(:departmentName)',
        { departmentName },
      );

    if (excludeId) {
      queryBuilder.andWhere('department.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL DEPARTMENTS WITH FILTERS AND PAGINATION
  async getAllDepartment(
    departmentQueryDto: DepartmentQueryDto,
  ): Promise<{ data: Department[]; total: number }> {
    const page = departmentQueryDto.page ?? 1;
    const limit = departmentQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('department');

    // COMPANY FILTER
    if (departmentQueryDto.company_id) {
      queryBuilder.andWhere('department.company_id = :companyId', {
        companyId: departmentQueryDto.company_id,
      });
    }

    // DEPARTMENT NAME SEARCH
    if (departmentQueryDto.search?.trim()) {
      queryBuilder.andWhere('department.department_name ILIKE :search', {
        search: `%${departmentQueryDto.search.trim()}%`,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy('department.created_at', 'DESC')
      .addOrderBy('department.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE DEPARTMENT
  async deleteDepartment(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return Boolean(result.affected);
  }
}
