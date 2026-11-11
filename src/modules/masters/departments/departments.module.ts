
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DepartmentsController } from './departments.controller.js';
import { DepartmentsService } from './departments.service.js';
import { Department } from './entities/department.entity.js';
import { DepartmentsRepository } from './repositories/departments.repository.js';
import { CompanyModule } from '../companies/company.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    CompanyModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
  exports: [DepartmentsService, DepartmentsRepository],
})
export class DepartmentsModule {}
