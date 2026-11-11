import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from '../entities/organization.entity.js';
import type { CreateOrganizationDto } from '../dto/create-organization.dto.js';
import type { OrganizationQueryDto } from '../dto/organization-query.dto.js';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(Organization)
    private readonly repository: Repository<Organization>,
  ) {}

  // CREATE ORGANIZATION
  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    const organization = this.repository.create({
      ...createOrganizationDto,
      status: 'ACTIVE',
    });

    return this.repository.save(organization);
  }

  // UPDATE ORGANIZATION
  async updateOrganization(organization: Organization): Promise<Organization> {
    return this.repository.save(organization);
  }

  // CHECK ORGANIZATION EXISTS
  organizationExists(id: number): Promise<boolean> {
    return this.repository.existsBy({ id });
  }

  // GET ORGANIZATION BY ID (call organizationExists first; throws when not found)
  getOrganizationById(id: number): Promise<Organization> {
    return this.repository.findOneByOrFail({ id });
  }

  // CHECK DUPLICATE ORGANIZATION (case-insensitive name).
  // Pass excludeId during update so the organization does not match itself.
  async isDuplicateOrganization(
    organizationName: string,
    excludeId?: number,
  ): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('organization')
      .where('LOWER(organization.organizationName) = LOWER(:organizationName)', {
        organizationName,
      });

    if (excludeId) {
      queryBuilder.andWhere('organization.id != :excludeId', { excludeId });
    }

    return (await queryBuilder.getCount()) > 0;
  }

  // GET ALL ORGANIZATIONS WITH FILTERS AND PAGINATION
  async getAllOrganization(
    organizationQueryDto: OrganizationQueryDto,
  ): Promise<{ data: Organization[]; total: number }> {
    const page = organizationQueryDto.page ?? 1;
    const limit = organizationQueryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('organization');

    // STATUS FILTER
    if (organizationQueryDto.status) {
      queryBuilder.andWhere('organization.status = :status', {
        status: organizationQueryDto.status,
      });
    }

    // ORGANIZATION NAME SEARCH
    if (organizationQueryDto.search?.trim()) {
      queryBuilder.andWhere('organization.organizationName ILIKE :search', {
        search: `%${organizationQueryDto.search.trim()}%`,
      });
    }

    // SORTING AND PAGINATION
    queryBuilder
      .orderBy('organization.organizationName', 'ASC')
      .addOrderBy('organization.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total };
  }

  // DELETE ORGANIZATION (soft delete: marks it INACTIVE)
  async deleteOrganization(id: number): Promise<boolean> {
    const result = await this.repository.update({ id }, { status: 'INACTIVE' });

    return Boolean(result.affected);
  }
}
