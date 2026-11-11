import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { LeaveTypeService } from './leave-type.service.js';

import { CreateLeaveTypeDto } from './dto/create-leave-type.dto.js';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto.js';
import { UpdateLeaveTypeStatusDto } from './dto/update-leave-type-status.dto.js';
import { LeaveTypeQueryDto } from './dto/leave-type-query.dto.js';

@ApiTags('Leave Types')
@Controller('v1/leave-types')
export class LeaveTypeController {
  private readonly logger = new Logger(LeaveTypeController.name);

  constructor(
    private readonly leaveTypeService: LeaveTypeService,
  ) {}

  // CREATE LEAVE TYPE
  @Post('leave-type')
  @ApiOperation({ summary: 'Create a new leave type' })
  async createLeaveType(
    @Body()
    createLeaveTypeDto: CreateLeaveTypeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response =
        await this.leaveTypeService.createLeaveType(createLeaveTypeDto);

      res.status(response.statusCode);

      return response;
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

  // GET ALL LEAVE TYPES
  @Get('leave-types')
  @ApiOperation({
    summary: 'Get all leave types with pagination and filters',
  })
  async getAllLeaveTypes(
    @Query() leaveTypeQueryDto: LeaveTypeQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response =
        await this.leaveTypeService.retrievingAllLeaveTypes(leaveTypeQueryDto);

      res.status(response.statusCode);

      return response;
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

  // GET LEAVE TYPE BY ID
  @Get('leave-type/:id')
  @ApiOperation({ summary: 'Get leave type by ID' })
  @ApiParam({ name: 'id', example: '1' })
  async getLeaveTypeById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await this.leaveTypeService.retrievingLeaveTypeById(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
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

  // UPDATE LEAVE TYPE
  @Patch('leave-type/:id')
  @ApiOperation({ summary: 'Update leave type by ID' })
  @ApiParam({ name: 'id', example: '1' })
  async updateLeaveTypeDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateLeaveTypeDto: UpdateLeaveTypeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await this.leaveTypeService.updateLeaveType(
        id,
        updateLeaveTypeDto,
      );

      res.status(response.statusCode);

      return response;
    } catch (error) {
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

  // UPDATE LEAVE TYPE STATUS
  @Patch('leave-type/:id/status')
  @ApiOperation({ summary: 'Activate or deactivate leave type by ID' })
  @ApiParam({ name: 'id', example: '1' })
  async updateLeaveTypeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateLeaveTypeStatusDto: UpdateLeaveTypeStatusDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await this.leaveTypeService.updateLeaveTypeStatus(
        id,
        updateLeaveTypeStatusDto.isActive,
      );

      res.status(response.statusCode);

      return response;
    } catch (error) {
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

  // DELETE LEAVE TYPE
  @Delete('leave-type/:id')
  @ApiOperation({ summary: 'Delete leave type by ID' })
  @ApiParam({ name: 'id', example: '1' })
  async deleteLeaveType(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const response = await this.leaveTypeService.deleteLeaveType(id);

      res.status(response.statusCode);

      return response;
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