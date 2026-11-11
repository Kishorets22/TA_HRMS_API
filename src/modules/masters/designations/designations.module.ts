
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DesignationsController } from './designations.controller.js';
import { DesignationsService } from './designations.service.js';
import { Designation } from './entities/designation.entity.js';
import { DesignationsRepository } from './repositories/designations.repository.js';
import { CompanyModule } from '../companies/company.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Designation]),
    CompanyModule,
  ],
  controllers: [DesignationsController],
  providers: [DesignationsService, DesignationsRepository],
  exports: [DesignationsService, DesignationsRepository],
})
export class DesignationsModule {}
