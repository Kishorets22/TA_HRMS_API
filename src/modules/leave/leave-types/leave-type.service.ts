
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LeaveTypeRepository } from './repositories/leave-type.repository.js';
import type { CreateLeaveTypeDto } from './dto/create-leave-type.dto.js';
import type { UpdateLeaveTypeDto } from './dto/update-leave-type.dto.js';
import type { LeaveTypeQueryDto } from './dto/leave-type-query.dto.js';
import type {
  LeaveTypeResponse,
  LeaveTypeListResponse,
} from './dto/leave-type-response.dto.js';

import { LEAVE_TYPE_RESPONSES } from './constants/leave-type.constants.js';

import {
  isValidLeaveTypeId,
  isValidLeaveTypeUnit,
  isValidCarryForwardDays,
  isEmptyLeaveTypeUpdate,
  formatCarryForwardDays,
} from './utils/leave-type-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class LeaveTypeService {
  private readonly logger = new Logger(LeaveTypeService.name);

  constructor(
    private readonly leaveTypeRepository: LeaveTypeRepository,
  ) {}

  // --------------------------------------------------
  // Create Leave Type
  // --------------------------------------------------

  async createLeaveType(
    createLeaveTypeDto: CreateLeaveTypeDto,
  ): Promise<LeaveTypeResponse> {
    this.logger.log(
      `[LEAVE_TYPE] Creating "${createLeaveTypeDto.name}" with code ${createLeaveTypeDto.code}`,
    );

    try {
      if (!isValidLeaveTypeUnit(createLeaveTypeDto.unit)) {
        return LEAVE_TYPE_RESPONSES.invalidUnit();
      }

      if (!isValidCarryForwardDays(createLeaveTypeDto.maxCarryForwardDays)) {
        return LEAVE_TYPE_RESPONSES.invalidCarryForward();
      }

      const duplicate = await this.leaveTypeRepository.isDuplicateCode(
        createLeaveTypeDto.code,
      );

      if (duplicate) {
        this.logger.warn(
          `[LEAVE_TYPE] Duplicate leave type code "${createLeaveTypeDto.code}"`,
        );

        return LEAVE_TYPE_RESPONSES.duplicateCode();
      }

      const saved =
        await this.leaveTypeRepository.createLeaveType(createLeaveTypeDto);

      this.logger.log(
        `[LEAVE_TYPE] Leave type created with ID ${saved.id}`,
      );

      return LEAVE_TYPE_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while creating the Leave Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Leave Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------
  // Retrieve All Leave Types
  // --------------------------------------------------

  async retrievingAllLeaveTypes(
    leaveTypeQueryDto: LeaveTypeQueryDto,
  ): Promise<LeaveTypeListResponse | LeaveTypeResponse> {
    this.logger.log(
      `[LEAVE_TYPE] Fetching leave types (page=${leaveTypeQueryDto.page ?? 1}, limit=${leaveTypeQueryDto.limit ?? 10})`,
    );

    try {
      // Repository returns { data: LeaveType[], total: number }
      const { data, total } =
        await this.leaveTypeRepository.getAllLeaveTypes(leaveTypeQueryDto);

      this.logger.log(
        `[LEAVE_TYPE] Returned ${data.length} of ${total} matching leave types`,
      );

      return LEAVE_TYPE_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while retrieving all Leave Types: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Leave Types',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------
  // Retrieve Leave Type By ID
  // --------------------------------------------------

  async retrievingLeaveTypeById(
    id: number,
  ): Promise<LeaveTypeResponse> {
    try {
      if (!isValidLeaveTypeId(id)) {
        return LEAVE_TYPE_RESPONSES.invalidId(id);
      }

      const leaveType =
        await this.leaveTypeRepository.getLeaveTypeById(id);

      return LEAVE_TYPE_RESPONSES.fetched(leaveType);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`[LEAVE_TYPE] Leave type ${id} not found`);

        return LEAVE_TYPE_RESPONSES.notFound(id);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while retrieving the Leave Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Leave Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------
  // Update Leave Type
  // --------------------------------------------------

  async updateLeaveType(
    id: number,
    updateLeaveTypeDto: UpdateLeaveTypeDto,
  ): Promise<LeaveTypeResponse> {
    try {
      if (!isValidLeaveTypeId(id)) {
        return LEAVE_TYPE_RESPONSES.invalidId(id);
      }

      if (isEmptyLeaveTypeUpdate(updateLeaveTypeDto)) {
        return LEAVE_TYPE_RESPONSES.emptyUpdate();
      }

      const leaveType =
        await this.leaveTypeRepository.getLeaveTypeById(id);

      if (
        updateLeaveTypeDto.unit &&
        !isValidLeaveTypeUnit(updateLeaveTypeDto.unit)
      ) {
        return LEAVE_TYPE_RESPONSES.invalidUnit();
      }

      if (
        Object.hasOwn(updateLeaveTypeDto, 'maxCarryForwardDays') &&
        !isValidCarryForwardDays(
          updateLeaveTypeDto.maxCarryForwardDays ??
            leaveType.maxCarryForwardDays,
        )
      ) {
        return LEAVE_TYPE_RESPONSES.invalidCarryForward();
      }

      const code = updateLeaveTypeDto.code ?? leaveType.code;

      const maxCarryForwardDays = Object.hasOwn(
        updateLeaveTypeDto,
        'maxCarryForwardDays',
      )
        ? formatCarryForwardDays(
            updateLeaveTypeDto.maxCarryForwardDays ??
              leaveType.maxCarryForwardDays,
          )
        : leaveType.maxCarryForwardDays;

      const duplicate = await this.leaveTypeRepository.isDuplicateCode(
        code,
        leaveType.id,
      );

      if (duplicate) {
        this.logger.warn(
          `[LEAVE_TYPE] Duplicate leave type code "${code}"`,
        );

        return LEAVE_TYPE_RESPONSES.duplicateCode();
      }

      // Assign only the editable fields, never the raw request body.
      leaveType.code = code;
      leaveType.name = updateLeaveTypeDto.name ?? leaveType.name;
      leaveType.unit = updateLeaveTypeDto.unit ?? leaveType.unit;

      leaveType.isCompensatory =
        updateLeaveTypeDto.isCompensatory ?? leaveType.isCompensatory;

      leaveType.maxCarryForwardDays = maxCarryForwardDays;

      const updated =
        await this.leaveTypeRepository.updateLeaveType(leaveType);

      this.logger.log(`[LEAVE_TYPE] Leave type ${id} updated`);

      return LEAVE_TYPE_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`[LEAVE_TYPE] Leave type ${id} not found`);

        return LEAVE_TYPE_RESPONSES.notFound(id);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while updating the Leave Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Leave Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------
  // Update Leave Type Status
  // --------------------------------------------------

  async updateLeaveTypeStatus(
    id: number,
    isActive: boolean,
  ): Promise<LeaveTypeResponse> {
    try {
      if (!isValidLeaveTypeId(id)) {
        return LEAVE_TYPE_RESPONSES.invalidId(id);
      }

      const leaveType =
        await this.leaveTypeRepository.getLeaveTypeById(id);

      leaveType.isActive = isActive;

      const updated =
        await this.leaveTypeRepository.updateLeaveType(leaveType);

      this.logger.log(
        `[LEAVE_TYPE] Leave type ${id} status updated`,
      );

      return LEAVE_TYPE_RESPONSES.statusUpdated(updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`[LEAVE_TYPE] Leave type ${id} not found`);

        return LEAVE_TYPE_RESPONSES.notFound(id);
      }

      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while updating the Leave Type status: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Leave Type status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------
  // Delete Leave Type
  // --------------------------------------------------

  async deleteLeaveType(
    id: number,
  ): Promise<LeaveTypeResponse | ReturnType<typeof LEAVE_TYPE_RESPONSES.deleted>> {
    try {
      if (!isValidLeaveTypeId(id)) {
        return LEAVE_TYPE_RESPONSES.invalidId(id);
      }

      const deleted =
        await this.leaveTypeRepository.deleteLeaveType(id);

      if (!deleted) {
        this.logger.warn(`[LEAVE_TYPE] Leave type ${id} not found`);

        return LEAVE_TYPE_RESPONSES.notFound(id);
      }

      this.logger.log(
        `[LEAVE_TYPE] Leave type ${id} deleted successfully`,
      );

      return LEAVE_TYPE_RESPONSES.deleted(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[LEAVE_TYPE] An error occurred while deleting the Leave Type: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Leave Type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
