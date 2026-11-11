import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { OrganizationRepository } from './repositories/organization.repository.js';
import type { CreateOrganizationDto } from './dto/create-organization.dto.js';
import type { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import type { OrganizationQueryDto } from './dto/organization-query.dto.js';

import type {
  OrganizationDeleteResponse,
  OrganizationListResponse,
  OrganizationResponse,
} from './dto/organization-response.dto.js';

import { ORGANIZATION_RESPONSES } from './constants/organization.constants.js';

import { isValidOrganizationId } from './utils/organization-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationResponse> {
    this.logger.log(
      `[ORGANIZATION] Creating "${createOrganizationDto.organizationName}"`,
    );
    try {
      const duplicate = await this.organizationRepository.isDuplicateOrganization(
        createOrganizationDto.organizationName,
      );
      if (duplicate) {
        this.logger.warn(
          `[ORGANIZATION] Duplicate organization "${createOrganizationDto.organizationName}"`,
        );
        return ORGANIZATION_RESPONSES.duplicate(createOrganizationDto.organizationName);
      }

      const saved =
        await this.organizationRepository.createOrganization(createOrganizationDto);
      this.logger.log(`[ORGANIZATION] Organization created with ID ${saved.id}`);

      return ORGANIZATION_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[ORGANIZATION] An error occurred while creating the Organization: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrganization(
    organizationQueryDto: OrganizationQueryDto,
  ): Promise<OrganizationListResponse> {
    this.logger.log(
      `[ORGANIZATION] Fetching organizations (page=${organizationQueryDto.page ?? 1}, limit=${organizationQueryDto.limit ?? 10}, status=${organizationQueryDto.status ?? 'ALL'}, search="${organizationQueryDto.search ?? ''}")`,
    );
    try {
      const { data, total } =
        await this.organizationRepository.getAllOrganization(organizationQueryDto);
      this.logger.log(
        `[ORGANIZATION] Returned ${data.length} of ${total} matching organizations`,
      );

      return ORGANIZATION_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[ORGANIZATION] An error occurred while retrieving all Organizations: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Organizations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrganizationById(id: number): Promise<OrganizationResponse> {
    try {
      if (!isValidOrganizationId(id)) {
        return ORGANIZATION_RESPONSES.invalidId(id);
      }

      const exists = await this.organizationRepository.organizationExists(id);
      if (!exists) {
        this.logger.warn(`[ORGANIZATION] Organization ${id} not found`);
        return ORGANIZATION_RESPONSES.notFound(id);
      }

      const organization = await this.organizationRepository.getOrganizationById(id);

      return ORGANIZATION_RESPONSES.fetched(organization);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[ORGANIZATION] An error occurred while retrieving the Organization: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrganization(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<OrganizationResponse> {
    try {
      if (!isValidOrganizationId(id)) {
        return ORGANIZATION_RESPONSES.invalidId(id);
      }

      const exists = await this.organizationRepository.organizationExists(id);
      if (!exists) {
        this.logger.warn(`[ORGANIZATION] Organization ${id} not found`);
        return ORGANIZATION_RESPONSES.notFound(id);
      }

      const organization = await this.organizationRepository.getOrganizationById(id);

      const organizationName =
        updateOrganizationDto.organizationName ?? organization.organizationName;

      const duplicate = await this.organizationRepository.isDuplicateOrganization(
        organizationName,
        organization.id,
      );
      if (duplicate) {
        this.logger.warn(`[ORGANIZATION] Duplicate organization "${organizationName}"`);
        return ORGANIZATION_RESPONSES.duplicate(organizationName);
      }

      // Assign only the editable fields, never the raw request body.
      organization.organizationName = organizationName;
      organization.legalName = updateOrganizationDto.legalName ?? organization.legalName;
      organization.address = updateOrganizationDto.address ?? organization.address;
      organization.email = updateOrganizationDto.email ?? organization.email;
      organization.phone = updateOrganizationDto.phone ?? organization.phone;
      organization.status = updateOrganizationDto.status ?? organization.status;

      const updated = await this.organizationRepository.updateOrganization(organization);
      this.logger.log(`[ORGANIZATION] Organization ${id} updated`);

      return ORGANIZATION_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[ORGANIZATION] An error occurred while updating the Organization: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Soft delete: the row is kept and marked INACTIVE.
  async deleteOrganization(
    id: number,
  ): Promise<OrganizationDeleteResponse | OrganizationResponse> {
    try {
      if (!isValidOrganizationId(id)) {
        return ORGANIZATION_RESPONSES.invalidId(id);
      }

      const exists = await this.organizationRepository.organizationExists(id);
      if (!exists) {
        this.logger.warn(`[ORGANIZATION] Organization ${id} not found`);
        return ORGANIZATION_RESPONSES.notFound(id);
      }

      // Load first so the response can include the organization name.
      const organization = await this.organizationRepository.getOrganizationById(id);

      const deleted = await this.organizationRepository.deleteOrganization(id);
      if (!deleted) {
        this.logger.warn(`[ORGANIZATION] Organization ${id} not found`);
        return ORGANIZATION_RESPONSES.notFound(id);
      }

      this.logger.log(`[ORGANIZATION] Organization ${id} marked INACTIVE`);

      return ORGANIZATION_RESPONSES.deleted(organization.id, organization.organizationName);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[ORGANIZATION] An error occurred while deleting the Organization: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
