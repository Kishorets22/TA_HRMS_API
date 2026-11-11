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

import { DepartmentsService } from './departments.service.js';

import { CreateDepartmentDto } from './dto/create-department.dto.js';
import { UpdateDepartmentDto } from './dto/update-department.dto.js';
import { DepartmentQueryDto } from './dto/department-query.dto.js';

import type {
  DepartmentListResponse,
  DepartmentResponse,
  DepartmentDeleteResponse,
} from './dto/department-response.dto.js';

// TODO(auth): add AuthGuard and company-level authorization once auth exists.
@ApiTags('Departments')
@Controller('v1')
export class DepartmentsController {
  private readonly logger = new Logger(DepartmentsController.name);

  constructor(
    private readonly departmentsService: DepartmentsService,
  ) {}

  @Post('department')
  @ApiOperation({ summary: 'Create a new department' })
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DepartmentResponse> {
    try {
      const response = await this.departmentsService.createDepartment(createDepartmentDto);

      res.status(response.statusCode);

      return response;
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

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments with pagination and filters' })
  async getAllDepartment(
    @Query() departmentQueryDto: DepartmentQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DepartmentListResponse> {
    try {
      const response = await this.departmentsService.getAllDepartment(departmentQueryDto);

      res.status(response.statusCode);

      return response;
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

  @Get('department/:id')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async getDepartmentById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DepartmentResponse> {
    try {
      const response = await this.departmentsService.getDepartmentById(id);

      res.status(response.statusCode);

      return response;
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

  @Patch('department/:id')
  @ApiOperation({ summary: 'Update department by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DepartmentResponse> {
    try {
      const response = await this.departmentsService.updateDepartment(id, updateDepartmentDto);

      res.status(response.statusCode);

      return response;
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

  @Delete('department/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete department by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async deleteDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DepartmentDeleteResponse | DepartmentResponse> {
    try {
      const response = await this.departmentsService.deleteDepartment(id);

      res.status(response.statusCode);

      return response;
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
