import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity.js';
import { OrganizationController } from './organization.controller.js';
import { OrganizationService } from './organization.service.js';
import { OrganizationRepository } from './repositories/organization.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationModule {}