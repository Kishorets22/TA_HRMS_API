
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { EmployeesRepository } from './repositories/employees.repository.js';

import type { CreateEmployeeDto } from './dto/create-employee.dto.js';
import type { UpdateEmployeeDto } from './dto/update-employee.dto.js';

import { EMPLOYEE_RESPONSES } from './constants/employee.constants.js';

import {
  isValidEmployeeId,
} from './utils/employee-validation.utils.js';

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  // CREATE EMPLOYEE
  async createEmployee(data: CreateEmployeeDto) {
    this.logger.log(
      `[EMPLOYEE] Creating employee with email "${data.workEmail}"`,
    );

    try {
      // Validate employment dates
      if (
        data.dateOfExit &&
        data.dateOfExit < data.dateOfJoining
      ) {
        return EMPLOYEE_RESPONSES.invalidDateRange();
      }

      // Check duplicate work email
      const existingEmail =
        await this.employeesRepository.findByEmail(data.workEmail);

      if (existingEmail) {
        this.logger.warn(
          `[EMPLOYEE] Duplicate work email "${data.workEmail}"`,
        );

        return EMPLOYEE_RESPONSES.duplicate();
      }

      // Check duplicate employee ID
      const existingEmployeeId =
        await this.employeesRepository.findByEmployeeId(
          data.employeeId,
        );

      if (existingEmployeeId) {
        this.logger.warn(
          `[EMPLOYEE] Duplicate employee ID "${data.employeeId}"`,
        );

        return EMPLOYEE_RESPONSES.duplicateEmployeeId();
      }

      const saved =
        await this.employeesRepository.create(data);

      this.logger.log(
        `[EMPLOYEE] Employee created with ID ${saved.id}`,
      );

      return EMPLOYEE_RESPONSES.created(saved);
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
  async getAllEmployees() {
    this.logger.log('[EMPLOYEE] Fetching all Employees');

    try {
      const employees =
        await this.employeesRepository.findAll();

      this.logger.log(
        `[EMPLOYEE] Retrieved ${employees.length} Employees`,
      );

      return EMPLOYEE_RESPONSES.listed(
        employees,
        employees.length,
      );
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
  async getEmployeeById(id: string) {
    this.logger.log(
      `[EMPLOYEE] Fetching Employee with ID ${id}`,
    );

    try {
      if (!isValidEmployeeId(id)) {
        return EMPLOYEE_RESPONSES.invalidId(id);
      }

      const employee =
        await this.employeesRepository.findById(id);

      return EMPLOYEE_RESPONSES.fetched(employee);
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
  async updateEmployee(
    id: string,
    data: UpdateEmployeeDto,
  ) {
    this.logger.log(
      `[EMPLOYEE] Updating Employee with ID ${id}`,
    );

    try {
      if (!isValidEmployeeId(id)) {
        return EMPLOYEE_RESPONSES.invalidId(id);
      }

      const employee =
        await this.employeesRepository.findById(id);

      // Check duplicate work email
      if (
        data.workEmail &&
        data.workEmail !== employee.workEmail
      ) {
        const existingEmail =
          await this.employeesRepository.findByEmail(
            data.workEmail,
          );

        if (existingEmail.id !== id) {
          this.logger.warn(
            `[EMPLOYEE] Duplicate work email "${data.workEmail}"`,
          );

          return EMPLOYEE_RESPONSES.duplicate();
        }
      }

      // Check duplicate employee ID
      if (
        data.employeeId &&
        data.employeeId !== employee.employeeId
      ) {
        const existingEmployeeId =
          await this.employeesRepository.findByEmployeeId(
            data.employeeId,
          );

        if (existingEmployeeId.id !== id) {
          this.logger.warn(
            `[EMPLOYEE] Duplicate employee ID "${data.employeeId}"`,
          );

          return EMPLOYEE_RESPONSES.duplicateEmployeeId();
        }
      }

      // Validate effective employment dates
      const effectiveJoiningDate =
        data.dateOfJoining ?? employee.dateOfJoining;

      const effectiveExitDate =
  data.dateOfExit ?? employee.dateOfExit;

      if (
        effectiveExitDate &&
        effectiveExitDate < effectiveJoiningDate
      ) {
        return EMPLOYEE_RESPONSES.invalidDateRange();
      }

      const updated =
        await this.employeesRepository.update(id, data);

      this.logger.log(
        `[EMPLOYEE] Employee ${id} updated successfully`,
      );

      return EMPLOYEE_RESPONSES.updated(updated);
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
  async deleteEmployee(id: string) {
    this.logger.log(
      `[EMPLOYEE] Deleting Employee with ID ${id}`,
    );

    try {
      if (!isValidEmployeeId(id)) {
        return EMPLOYEE_RESPONSES.invalidId(id);
      }

      const employee =
        await this.employeesRepository.findById(id);

      await this.employeesRepository.delete(employee.id);

      this.logger.log(
        `[EMPLOYEE] Employee ${id} deleted successfully`,
      );

      return EMPLOYEE_RESPONSES.deleted(employee);
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
