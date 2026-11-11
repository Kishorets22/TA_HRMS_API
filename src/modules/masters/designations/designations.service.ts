
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { DesignationsRepository } from './repositories/designations.repository.js';
import type { CreateDesignationDto } from './dto/create-designation.dto.js';
import type { UpdateDesignationDto } from './dto/update-designation.dto.js';
import type { DesignationQueryDto } from './dto/designation-query.dto.js';

import type {
  DesignationDeleteResponse,
  DesignationListResponse,
  DesignationResponse,
} from './dto/designation-response.dto.js';

import { DESIGNATION_RESPONSES } from './constants/designations.constants.js';

import { isValidDesignationId } from './utils/designation-validation.utils.js';

// Expected failures (400 / 404) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class DesignationsService {
  private readonly logger = new Logger(DesignationsService.name);

  constructor(
    private readonly designationsRepository: DesignationsRepository,
  ) {}

 async createDesignation(
  createDesignationDto: CreateDesignationDto,
): Promise<DesignationResponse> {
  this.logger.log(
    `[DESIGNATION] Creating "${createDesignationDto.designationName}"`,
  );

  try {
    const exists =
  await this.designationsRepository
    .designationExistsByName(
      createDesignationDto.designationName,
      createDesignationDto.departmentId,
    );

    if (exists) {
      this.logger.warn(
        `[DESIGNATION] Designation "${createDesignationDto.designationName}" already exists`,
      );

      return DESIGNATION_RESPONSES.duplicate(
        createDesignationDto.designationName,
      );
    }

    const saved = await this.designationsRepository.createDesignation(
      createDesignationDto,
    );

    this.logger.log(`[DESIGNATION] Designation created with ID ${saved.id}`);

    return DESIGNATION_RESPONSES.created(saved);
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    this.logger.error(
      `[DESIGNATION] An error occurred while creating the Designation: ${(error as Error).message}`,
      (error as Error).stack,
    );

    throw new HttpException(
      'An error occurred while creating the Designation',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  async getAllDesignations(
    designationQueryDto: DesignationQueryDto,
  ): Promise<DesignationListResponse> {
    this.logger.log(
      `[DESIGNATION] Fetching designations (page=${designationQueryDto.page ?? 1}, limit=${designationQueryDto.limit ?? 10}, search="${designationQueryDto.search ?? ''}")`,
    );
    try {
      const { data, total } =
        await this.designationsRepository.getAllDesignations(
          designationQueryDto,
        );
      this.logger.log(
        `[DESIGNATION] Returned ${data.length} of ${total} matching designations`,
      );

      return DESIGNATION_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while retrieving all Designations: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Designations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDesignationById(id: number): Promise<DesignationResponse> {
    try {
      if (!isValidDesignationId(id)) {
        return DESIGNATION_RESPONSES.invalidId(id);
      }

      const exists = await this.designationsRepository.designationExists(id);
      if (!exists) {
        this.logger.warn(`[DESIGNATION] Designation ${id} not found`);
        return DESIGNATION_RESPONSES.notFound(id);
      }

      const designation =
        await this.designationsRepository.getDesignationById(id);

      return DESIGNATION_RESPONSES.fetched(designation);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while retrieving the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDesignation(
    id: number,
    updateDesignationDto: UpdateDesignationDto,
  ): Promise<DesignationResponse> {
    try {
      if (!isValidDesignationId(id)) {
        return DESIGNATION_RESPONSES.invalidId(id);
      }

      const exists = await this.designationsRepository.designationExists(id);
      if (!exists) {
        this.logger.warn(`[DESIGNATION] Designation ${id} not found`);
        return DESIGNATION_RESPONSES.notFound(id);
      }

      const designation =
        await this.designationsRepository.getDesignationById(id);

      // Assign only the editable fields, never the raw request body.
      designation.designationName =
        updateDesignationDto.designationName ?? designation.designationName;
      designation.departmentId =
        updateDesignationDto.departmentId ?? designation.departmentId;
      designation.levelId =
        updateDesignationDto.levelId ?? designation.levelId;

      const updated = await this.designationsRepository.updateDesignation(
        designation,
      );
      this.logger.log(`[DESIGNATION] Designation ${id} updated`);

      return DESIGNATION_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while updating the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteDesignation(
    id: number,
  ): Promise<DesignationDeleteResponse | DesignationResponse> {
    try {
      if (!isValidDesignationId(id)) {
        return DESIGNATION_RESPONSES.invalidId(id);
      }

      const exists = await this.designationsRepository.designationExists(id);
      if (!exists) {
        this.logger.warn(`[DESIGNATION] Designation ${id} not found`);
        return DESIGNATION_RESPONSES.notFound(id);
      }

      const designation =
        await this.designationsRepository.getDesignationById(id);

      const deleted =
        await this.designationsRepository.deleteDesignation(id);
      if (!deleted) {
        this.logger.warn(`[DESIGNATION] Designation ${id} not found`);
        return DESIGNATION_RESPONSES.notFound(id);
      }

      this.logger.log(`[DESIGNATION] Designation ${id} deleted`);

      return DESIGNATION_RESPONSES.deleted(
        designation.id,
        designation.designationName,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while deleting the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
