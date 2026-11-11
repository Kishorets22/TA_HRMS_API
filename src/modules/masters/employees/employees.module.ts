
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity.js';

import { EmployeesController } from './employees.controller.js';

import { EmployeesService } from './employees.service.js';

import { EmployeesRepository } from './repositories/employees.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
  ],

  controllers: [
    EmployeesController,
  ],

  providers: [
    EmployeesService,
    EmployeesRepository,
  ],

  exports: [
    EmployeesService,
    EmployeesRepository,
  ],
})
export class EmployeesModule {}
