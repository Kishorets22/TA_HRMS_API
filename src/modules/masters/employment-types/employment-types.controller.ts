import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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

import type { Response } from 'express';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EmploymentTypesService } from './employment-types.service.js';

import { CreateEmploymentTypeDto } from './dto/create-employment-type.dto.js';
import { UpdateEmploymentTypeDto } from './dto/update-employment-type.dto.js';
import { EmploymentTypeQueryDto } from './dto/employment-type-query.dto.js';

import type {
  EmploymentTypeListResponse,
  EmploymentTypeResponse,
} from './dto/employment-type-response.dto.js';

// TODO(auth): add AuthGuard once auth exists.
@ApiTags('Employment Types')
@Controller('v1')
export class EmploymentTypesController {
  private readonly logger = new Logger(EmploymentTypesController.name);

  constructor(
    private readonly employmentTypesService: EmploymentTypesService,
  ) {}

  @Post('employment-type')
  @ApiOperation({ summary: 'Create a new employment type' })
  async createEmploymentType(
    @Body() createEmploymentTypeDto: CreateEmploymentTypeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmploymentTypeResponse> {
    try {
      const response =
        await this.employmentTypesService.createEmploymentType(createEmploymentTypeDto);

      res.status(response.statusCode);

      return response;
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

  @Get('employment-types')
  @ApiOperation({ summary: 'Get all employment types with pagination and filters' })
  async getAllEmploymentType(
    @Query() employmentTypeQueryDto: EmploymentTypeQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmploymentTypeListResponse> {
    try {
      const response =
        await this.employmentTypesService.getAllEmploymentType(employmentTypeQueryDto);

      res.status(response.statusCode);

      return response;
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

  @Get('employment-type/:id')
  @ApiOperation({ summary: 'Get employment type by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async getEmploymentTypeById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmploymentTypeResponse> {
    try {
      const response = await this.employmentTypesService.getEmploymentTypeById(id);

      res.status(response.statusCode);

      return response;
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

  @Patch('employment-type/:id')
  @ApiOperation({ summary: 'Update employment type by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async updateEmploymentType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmploymentTypeDto: UpdateEmploymentTypeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmploymentTypeResponse> {
    try {
      const response = await this.employmentTypesService.updateEmploymentType(
        id,
        updateEmploymentTypeDto,
      );

      res.status(response.statusCode);

      return response;
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

  @Delete('employment-type/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete (deactivate) employment type by ID',
    description: 'Sets isActive to false instead of deleting the record.',
  })
  @ApiParam({ name: 'id', example: 1 })
  async deleteEmploymentType(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmploymentTypeResponse> {
    try {
      const response = await this.employmentTypesService.deleteEmploymentType(id);

      res.status(response.statusCode);

      return response;
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
