
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmploymentType } from './entities/employment-type.entity.js';
import { EmploymentTypesController } from './employment-types.controller.js';
import { EmploymentTypesService } from './employment-types.service.js';
import { EmploymentTypesRepository } from './repositories/employment-types.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([EmploymentType])],
  controllers: [EmploymentTypesController],
  providers: [EmploymentTypesService, EmploymentTypesRepository],
  exports: [EmploymentTypesRepository],
})
export class EmploymentTypesModule {}
