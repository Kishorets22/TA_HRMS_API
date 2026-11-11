import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { EmploymentTypesRepository } from './repositories/employment-types.repository.js';
import type { CreateEmploymentTypeDto } from './dto/create-employment-type.dto.js';
import type { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto.js';
import type { EmploymentTypeQueryDto } from './dto/employment-type-query.dto.js';

import type {
  EmploymentTypeListResponse,
  EmploymentTypeResponse,
} from './dto/employment-type-response.dto.js';

import { EMPLOYMENT_TYPE_RESPONSES } from './constants/employment-type.constants.js';

import { isValidEmploymentTypeId } from './utils/employment-type-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class EmploymentTypesService {
  private readonly logger = new Logger(EmploymentTypesService.name);

  constructor(
    private readonly employmentTypesRepository: EmploymentTypesRepository,
  ) {}

  async createEmploymentType(
    createEmploymentTypeDto: CreateEmploymentTypeDto,
  ): Promise<EmploymentTypeResponse> {
    this.logger.log(
      `[EMPLOYMENT TYPE] Creating "${createEmploymentTypeDto.employmentTypeName}"`,
    );
    try {
      const duplicate =
        await this.employmentTypesRepository.isDuplicateEmploymentType(
          createEmploymentTypeDto.employmentTypeName,
        );
      if (duplicate) {
        this.logger.warn(
          `[EMPLOYMENT TYPE] Duplicate employment type "${createEmploymentTypeDto.employmentTypeName}"`,
        );
        return EMPLOYMENT_TYPE_RESPONSES.duplicate();
      }

      const saved =
        await this.employmentTypesRepository.createEmploymentType(createEmploymentTypeDto);
      this.logger.log(`[EMPLOYMENT TYPE] Employment type created with ID ${saved.id}`);

      return EMPLOYMENT_TYPE_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYMENT TYPE] An error occurred while creating the Employment Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Employment Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllEmploymentType(
    employmentTypeQueryDto: EmploymentTypeQueryDto,
  ): Promise<EmploymentTypeListResponse> {
    this.logger.log(
      `[EMPLOYMENT TYPE] Fetching employment types (page=${employmentTypeQueryDto.page ?? 1}, limit=${employmentTypeQueryDto.limit ?? 10}, isActive=${employmentTypeQueryDto.isActive ?? 'ALL'}, search="${employmentTypeQueryDto.search ?? ''}")`,
    );
    try {
      const { data, total } =
        await this.employmentTypesRepository.getAllEmploymentType(employmentTypeQueryDto);
      this.logger.log(
        `[EMPLOYMENT TYPE] Returned ${data.length} of ${total} matching employment types`,
      );

      return EMPLOYMENT_TYPE_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYMENT TYPE] An error occurred while retrieving all Employment Types: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Employment Types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEmploymentTypeById(id: number): Promise<EmploymentTypeResponse> {
    try {
      if (!isValidEmploymentTypeId(id)) {
        return EMPLOYMENT_TYPE_RESPONSES.invalidId(id);
      }

      const exists = await this.employmentTypesRepository.employmentTypeExists(id);
      if (!exists) {
        this.logger.warn(`[EMPLOYMENT TYPE] Employment type ${id} not found`);
        return EMPLOYMENT_TYPE_RESPONSES.notFound(id);
      }

      const employmentType =
        await this.employmentTypesRepository.getEmploymentTypeById(id);

      return EMPLOYMENT_TYPE_RESPONSES.fetched(employmentType);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYMENT TYPE] An error occurred while retrieving the Employment Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Employment Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEmploymentType(
    id: number,
    updateEmploymentTypeDto: UpdateEmploymentTypeDto,
  ): Promise<EmploymentTypeResponse> {
    try {
      if (!isValidEmploymentTypeId(id)) {
        return EMPLOYMENT_TYPE_RESPONSES.invalidId(id);
      }

      const exists = await this.employmentTypesRepository.employmentTypeExists(id);
      if (!exists) {
        this.logger.warn(`[EMPLOYMENT TYPE] Employment type ${id} not found`);
        return EMPLOYMENT_TYPE_RESPONSES.notFound(id);
      }

      const employmentType =
        await this.employmentTypesRepository.getEmploymentTypeById(id);

      const employmentTypeName =
        updateEmploymentTypeDto.employmentTypeName ?? employmentType.employmentTypeName;

      const duplicate =
        await this.employmentTypesRepository.isDuplicateEmploymentType(
          employmentTypeName,
          employmentType.id,
        );
      if (duplicate) {
        this.logger.warn(`[EMPLOYMENT TYPE] Duplicate employment type "${employmentTypeName}"`);
        return EMPLOYMENT_TYPE_RESPONSES.duplicate();
      }

      // Assign only the editable fields, never the raw request body.
      employmentType.employmentTypeName = employmentTypeName;
      employmentType.description =
        updateEmploymentTypeDto.description ?? employmentType.description;
      employmentType.isActive =
        updateEmploymentTypeDto.isActive ?? employmentType.isActive;

      const updated =
        await this.employmentTypesRepository.updateEmploymentType(employmentType);
      this.logger.log(`[EMPLOYMENT TYPE] Employment type ${id} updated`);

      return EMPLOYMENT_TYPE_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYMENT TYPE] An error occurred while updating the Employment Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Employment Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Soft delete: marks the employment type inactive instead of removing it.
  async deleteEmploymentType(id: number): Promise<EmploymentTypeResponse> {
    try {
      if (!isValidEmploymentTypeId(id)) {
        return EMPLOYMENT_TYPE_RESPONSES.invalidId(id);
      }

      const deleted = await this.employmentTypesRepository.deleteEmploymentType(id);
      if (!deleted) {
        this.logger.warn(`[EMPLOYMENT TYPE] Employment type ${id} not found`);
        return EMPLOYMENT_TYPE_RESPONSES.notFound(id);
      }

      const deactivated =
        await this.employmentTypesRepository.getEmploymentTypeById(id);
      this.logger.log(`[EMPLOYMENT TYPE] Employment type ${id} deactivated`);

      return EMPLOYMENT_TYPE_RESPONSES.deleted(deactivated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYMENT TYPE] An error occurred while deleting the Employment Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Employment Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
