import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { DepartmentsRepository } from './repositories/departments.repository.js';
import { CompanyRepository } from '../companies/repositories/company.repository.js';
import type { CreateDepartmentDto } from './dto/create-department.dto.js';
import type { UpdateDepartmentDto } from './dto/update-department.dto.js';
import type { DepartmentQueryDto } from './dto/department-query.dto.js';

import type {
  DepartmentListResponse,
  DepartmentResponse,
  DepartmentDeleteResponse,
} from './dto/department-response.dto.js';

import { DEPARTMENT_RESPONSES } from './constants/departments.constants.js';

import { isValidDepartmentId } from './utils/department-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  constructor(
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponse> {
    this.logger.log(
      `[DEPARTMENT] Creating "${createDepartmentDto.department_name}" for company ${createDepartmentDto.company_id}`,
    );
    try {
      const company = await this.companyRepository.findCompanyById(
        createDepartmentDto.company_id,
      );
      if (!company) {
        this.logger.warn(`[DEPARTMENT] Company ${createDepartmentDto.company_id} not found`);
        return DEPARTMENT_RESPONSES.companyNotFound(createDepartmentDto.company_id);
      }

      const duplicate = await this.departmentsRepository.isDuplicateDepartment(
        createDepartmentDto.company_id,
        createDepartmentDto.department_name,
      );
      if (duplicate) {
        this.logger.warn(`[DEPARTMENT] Duplicate department "${createDepartmentDto.department_name}"`);
        return DEPARTMENT_RESPONSES.duplicate();
      }

      const saved = await this.departmentsRepository.createDepartment(createDepartmentDto);
      this.logger.log(`[DEPARTMENT] Department created with ID ${saved.id}`);

      return DEPARTMENT_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DEPARTMENT] An error occurred while creating the Department: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllDepartment(
    departmentQueryDto: DepartmentQueryDto,
  ): Promise<DepartmentListResponse> {
    this.logger.log(
      `[DEPARTMENT] Fetching departments (page=${departmentQueryDto.page ?? 1}, limit=${departmentQueryDto.limit ?? 10}, companyId=${departmentQueryDto.company_id ?? 'ALL'}, search="${departmentQueryDto.search ?? ''}")`,
    );
    try {
      const { data, total } =
        await this.departmentsRepository.getAllDepartment(departmentQueryDto);
      this.logger.log(
        `[DEPARTMENT] Returned ${data.length} of ${total} matching departments`,
      );

      return DEPARTMENT_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DEPARTMENT] An error occurred while retrieving all Departments: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Departments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDepartmentById(id: number): Promise<DepartmentResponse> {
    try {
      if (!isValidDepartmentId(id)) {
        return DEPARTMENT_RESPONSES.invalidId(id);
      }

      const exists = await this.departmentsRepository.departmentExists(id);
      if (!exists) {
        this.logger.warn(`[DEPARTMENT] Department ${id} not found`);
        return DEPARTMENT_RESPONSES.notFound(id);
      }

      const department = await this.departmentsRepository.getDepartmentById(id);

      return DEPARTMENT_RESPONSES.fetched(department);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DEPARTMENT] An error occurred while retrieving the Department: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDepartment(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponse> {
    try {
      if (!isValidDepartmentId(id)) {
        return DEPARTMENT_RESPONSES.invalidId(id);
      }

      const exists = await this.departmentsRepository.departmentExists(id);
      if (!exists) {
        this.logger.warn(`[DEPARTMENT] Department ${id} not found`);
        return DEPARTMENT_RESPONSES.notFound(id);
      }

      const department = await this.departmentsRepository.getDepartmentById(id);

      const departmentName =
        updateDepartmentDto.department_name ?? department.department_name;

      const duplicate = await this.departmentsRepository.isDuplicateDepartment(
        department.company_id,
        departmentName,
        department.id,
      );
      if (duplicate) {
        this.logger.warn(`[DEPARTMENT] Duplicate department "${departmentName}"`);
        return DEPARTMENT_RESPONSES.duplicate();
      }

      // Assign only the editable fields, never the raw request body.
      department.department_name = departmentName;
      department.description =
        updateDepartmentDto.description ?? department.description;
      department.is_active =
        updateDepartmentDto.is_active ?? department.is_active;

      const updated = await this.departmentsRepository.updateDepartment(department);
      this.logger.log(`[DEPARTMENT] Department ${id} updated`);

      return DEPARTMENT_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DEPARTMENT] An error occurred while updating the Department: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDepartment(
    id: number,
  ): Promise<DepartmentDeleteResponse | DepartmentResponse> {
    try {
      if (!isValidDepartmentId(id)) {
        return DEPARTMENT_RESPONSES.invalidId(id);
      }

      const exists = await this.departmentsRepository.departmentExists(id);
      if (!exists) {
        this.logger.warn(`[DEPARTMENT] Department ${id} not found`);
        return DEPARTMENT_RESPONSES.notFound(id);
      }

      // Load first so the response can include the department name.
      const department = await this.departmentsRepository.getDepartmentById(id);

      const deleted = await this.departmentsRepository.deleteDepartment(id);
      if (!deleted) {
        this.logger.warn(`[DEPARTMENT] Department ${id} not found`);
        return DEPARTMENT_RESPONSES.notFound(id);
      }

      this.logger.log(`[DEPARTMENT] Department ${id} deleted`);

      return DEPARTMENT_RESPONSES.deleted(
        department.id,
        department.department_name,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DEPARTMENT] An error occurred while deleting the Department: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Department',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
