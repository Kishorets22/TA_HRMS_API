
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
  Post,
  Put,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeesService } from './employees.service.js';

import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

import type {
  EmployeeListResponse,
  EmployeeResponse,
} from './constants/employee.constants.js';

// (auth): Add AuthGuard and role-based permissions.
@ApiTags('Employees')
@Controller('v1/employees')
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);

  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  // CREATE EMPLOYEE
  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  async createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeResponse> {
    try {
      const response =
        await this.employeesService.createEmployee(createEmployeeDto);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYEE] An error occurred while creating the Employee: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET ALL EMPLOYEES
  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  async getAllEmployees(
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeListResponse> {
    try {
      const response =
        await this.employeesService.getAllEmployees();

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYEE] An error occurred while retrieving all Employees: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Employees',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET EMPLOYEE BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({ name: 'id', example: '10001' })
  async getEmployeeById(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeResponse> {
    try {
      const response =
        await this.employeesService.getEmployeeById(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYEE] An error occurred while retrieving the Employee: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // UPDATE EMPLOYEE
  @Put(':id')
  @ApiOperation({ summary: 'Update employee by ID' })
  @ApiParam({ name: 'id', example: '10001' })
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeResponse> {
    try {
      const response = await this.employeesService.updateEmployee(
        id,
        updateEmployeeDto,
      );

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYEE] An error occurred while updating the Employee: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE EMPLOYEE
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete employee by ID',
    description: 'Permanently deletes the employee record.',
  })
  @ApiParam({ name: 'id', example: '10001' })
  async deleteEmployee(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeResponse> {
    try {
      const response =
        await this.employeesService.deleteEmployee(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[EMPLOYEE] An error occurred while deleting the Employee: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Employee',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
