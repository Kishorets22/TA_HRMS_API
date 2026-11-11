import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyController } from './company.controller.js';
import { Company } from './entities/company.entity.js';
import { CompanyRepository } from './repositories/company.repository.js';
import { CompanyService } from './company.service.js';
import { OrganizationModule } from '../organizations/organization.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    OrganizationModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyRepository, CompanyService],
  exports: [CompanyRepository],
})
export class CompanyModule {}
