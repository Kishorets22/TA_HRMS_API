
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from '../entities/employee.entity.js';
import { CreateEmployeeDto } from '../dto/create-employee.dto.js';
import { UpdateEmployeeDto } from '../dto/update-employee.dto.js';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  // CREATE EMPLOYEE
  async create(data: CreateEmployeeDto): Promise<Employee> {
    const employee = this.repository.create(data);
    return this.repository.save(employee);
  }

  // GET ALL EMPLOYEES
  async findAll(): Promise<Employee[]> {
    return this.repository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // GET EMPLOYEE BY ID
  async findById(id: string): Promise<Employee> {
    const employee = await this.repository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  // GET EMPLOYEE BY EMAIL
  async findByEmail(email: string): Promise<Employee> {
    const employee = await this.repository.findOne({
      where: {
        workEmail: email,
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }

    return employee;
  }

  // GET EMPLOYEE BY EMPLOYEE ID
  async findByEmployeeId(employeeId: string): Promise<Employee> {
    const employee = await this.repository.findOne({
      where: {
        employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with employee ID ${employeeId} not found`,
      );
    }

    return employee;
  }

  // UPDATE EMPLOYEE
  async update(
    id: string,
    data: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findById(id);

    Object.assign(employee, data);

    return this.repository.save(employee);
  }

  // DELETE EMPLOYEE
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return (result.affected ?? 0) > 0;
  }
}
