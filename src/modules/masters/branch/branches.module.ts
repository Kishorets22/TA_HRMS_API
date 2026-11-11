import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Branch } from './entities/branch.entity.js';
import { BranchesController } from './branches.controller.js';
import { BranchesService } from './branches.service.js';
import { BranchesRepository } from './repositories/branches.repository.js';

import { CompanyModule } from '../companies/company.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
    CompanyModule,
  ],
  controllers: [BranchesController],
  providers: [
    BranchesService,
    BranchesRepository,
  ],
  exports: [BranchesService],
})
export class BranchesModule {}