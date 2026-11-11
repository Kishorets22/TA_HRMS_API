import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';

import { BranchesRepository } from './repositories/branches.repository.js';
import { CompanyRepository } from '../companies/repositories/company.repository.js';
import type { CreateBranchDto } from './dto/create-branch.dto.js';
import type { UpdateBranchDto } from './dto/update-branch.dto.js';
import type { BranchQueryDto } from './dto/branch-query.dto.js';

import type {
  BranchDeleteResponse,
  BranchListResponse,
  BranchResponse,
} from './dto/branch-response.dto.js';

import { BRANCH_RESPONSES } from './constants/branches.constants.js';

import { isValidBranchId } from './utils/branch-validation.utils.js';

// Expected failures (400 / 404 / 409) are returned as response objects;
// only unexpected errors are thrown, from the catch block.
@Injectable()
export class BranchesService {
  private readonly logger = new Logger(BranchesService.name);

  constructor(
    private readonly branchesRepository: BranchesRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async createBranch(createBranchDto: CreateBranchDto): Promise<BranchResponse> {
    this.logger.log(
      `[BRANCH] Creating "${createBranchDto.branchName}" for company ${createBranchDto.companyId}`,
    );
    try {
      const company = await this.companyRepository.findCompanyById(
        createBranchDto.companyId,
      );
      if (!company) {
        this.logger.warn(`[BRANCH] Company ${createBranchDto.companyId} not found`);
        return BRANCH_RESPONSES.companyNotFound(createBranchDto.companyId);
      }

      const duplicate = await this.branchesRepository.isDuplicateBranch(
        createBranchDto.companyId,
        createBranchDto.branchName,
      );
      if (duplicate) {
        this.logger.warn(`[BRANCH] Duplicate branch "${createBranchDto.branchName}"`);
        return BRANCH_RESPONSES.duplicate(createBranchDto.branchName);
      }

      const saved = await this.branchesRepository.createBranch(createBranchDto);
      this.logger.log(`[BRANCH] Branch created with ID ${saved.id}`);

      return BRANCH_RESPONSES.created(saved);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[BRANCH] An error occurred while creating the Branch: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Branch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBranch(branchQueryDto: BranchQueryDto): Promise<BranchListResponse> {
    this.logger.log(
      `[BRANCH] Fetching branches (page=${branchQueryDto.page ?? 1}, limit=${branchQueryDto.limit ?? 10}, companyId=${branchQueryDto.companyId ?? 'ALL'}, isActive=${branchQueryDto.isActive ?? 'ALL'}, search="${branchQueryDto.search ?? ''}")`,
    );
    try {
      const { data, total } =
        await this.branchesRepository.getAllBranch(branchQueryDto);
      this.logger.log(`[BRANCH] Returned ${data.length} of ${total} matching branches`);

      return BRANCH_RESPONSES.listed(data, total);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[BRANCH] An error occurred while retrieving all Branches: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Branches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBranchById(id: number): Promise<BranchResponse> {
    try {
      if (!isValidBranchId(id)) {
        return BRANCH_RESPONSES.invalidId(id);
      }

      const exists = await this.branchesRepository.branchExists(id);
      if (!exists) {
        this.logger.warn(`[BRANCH] Branch ${id} not found`);
        return BRANCH_RESPONSES.notFound(id);
      }

      const branch = await this.branchesRepository.getBranchById(id);

      return BRANCH_RESPONSES.fetched(branch);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[BRANCH] An error occurred while retrieving the Branch: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Branch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBranch(
    id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<BranchResponse> {
    try {
      if (!isValidBranchId(id)) {
        return BRANCH_RESPONSES.invalidId(id);
      }

      const exists = await this.branchesRepository.branchExists(id);
      if (!exists) {
        this.logger.warn(`[BRANCH] Branch ${id} not found`);
        return BRANCH_RESPONSES.notFound(id);
      }

      const branch = await this.branchesRepository.getBranchById(id);

      const branchName = updateBranchDto.branchName ?? branch.branchName;

      const duplicate = await this.branchesRepository.isDuplicateBranch(
        branch.companyId,
        branchName,
        branch.id,
      );
      if (duplicate) {
        this.logger.warn(`[BRANCH] Duplicate branch "${branchName}"`);
        return BRANCH_RESPONSES.duplicate(branchName);
      }

      // Assign only the editable fields, never the raw request body.
      branch.branchName = branchName;
      branch.address = updateBranchDto.address ?? branch.address;
      branch.isActive = updateBranchDto.isActive ?? branch.isActive;

      const updated = await this.branchesRepository.updateBranch(branch);
      this.logger.log(`[BRANCH] Branch ${id} updated`);

      return BRANCH_RESPONSES.updated(updated);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[BRANCH] An error occurred while updating the Branch: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Branch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBranch(id: number): Promise<BranchDeleteResponse | BranchResponse> {
    try {
      if (!isValidBranchId(id)) {
        return BRANCH_RESPONSES.invalidId(id);
      }

      const deleted = await this.branchesRepository.deleteBranch(id);
      if (!deleted) {
        this.logger.warn(`[BRANCH] Branch ${id} not found`);
        return BRANCH_RESPONSES.notFound(id);
      }

      this.logger.log(`[BRANCH] Branch ${id} deleted`);

      return BRANCH_RESPONSES.deleted(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[BRANCH] An error occurred while deleting the Branch: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Branch',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
