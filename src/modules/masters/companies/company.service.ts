import { HttpException, Injectable, Logger } from '@nestjs/common';
import { COMPANY_RESPONSES } from './constants/company.constants.js';
import type { CompanyQueryDto } from './dto/company-query.dto.js';
import type { CreateCompanyDto } from './dto/create-company.dto.js';
import type { UpdateCompanyDto } from './dto/update-company.dto.js';
import type {
  CompanyListResponse,
  CompanyResponse,
} from './dto/company-response.dto.js';
import type { DeleteResponseDto } from '../../../common/dto/generics/delete-response.dto.js';
import { CompanyRepository } from './repositories/company.repository.js';
import { OrganizationRepository } from '../organizations/repositories/organization.repository.js';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async createCompany(dto: CreateCompanyDto): Promise<CompanyResponse> {
    this.logSeparator('create-company');
    this.logger.log(
      `[COMPANY] Initiating creation for name: "${dto.companyName}" under organization ID ${dto.organizationId}`,
    );
    try {
      this.logger.log(
        `[COMPANY] Checking database that organization ID ${dto.organizationId} exists...`,
      );
      const organizationExists =
        await this.organizationRepository.organizationExists(
          dto.organizationId,
        );
      this.logger.log(
        `[COMPANY] Organization lookup complete. Record found: ${organizationExists}`,
      );

      if (!organizationExists) {
        this.logger.warn(
          `[COMPANY] Organization with ID ${dto.organizationId} not found`,
        );
        throw this.toHttpException(
          COMPANY_RESPONSES.organizationNotFound(dto.organizationId),
        );
      }

      this.logger.log(`[COMPANY] Saving new company record...`);
      const saved = await this.companyRepository.createAndSaveCompany(dto);
      this.logger.log(
        `[COMPANY] Company saved successfully with ID ${saved.id}`,
      );

      return COMPANY_RESPONSES.created(saved);
    } catch (error) {
      return this.handleError(error, 'creating');
    }
  }

  async getAllCompanies(query: CompanyQueryDto): Promise<CompanyListResponse> {
    this.logSeparator('get-all-companies');
    this.logger.log(
      `[COMPANY] Fetching companies (page=${query.page ?? 1}, limit=${query.limit ?? 10}, search="${query.search ?? ''}", status=${query.status ?? 'ALL'}, organizationId=${query.organizationId ?? 'ALL'})`,
    );
    try {
      this.logger.log(
        `[COMPANY] Requesting paginated company list from database...`,
      );
      const [companies, total] = await this.companyRepository.findAllCompanies(
        query.page ?? 1,
        query.limit ?? 10,
        query.search,
        query.status,
        query.organizationId,
      );
      this.logger.log(
        `[COMPANY] List retrieved. Returned ${companies.length} of ${total} matching companies.`,
      );

      return COMPANY_RESPONSES.listed(companies, total);
    } catch (error) {
      return this.handleError(error, 'retrieving');
    }
  }

  async getCompanyById(id: number): Promise<CompanyResponse> {
    this.logSeparator('get-company-by-id');
    this.logger.log(`[COMPANY] Fetching company with ID ${id}`);
    try {
      this.logger.log(`[COMPANY] Querying database for company ID ${id}...`);
      const company = await this.companyRepository.findCompanyById(id);
      this.logger.log(
        `[COMPANY] Lookup complete for ID ${id}. Record found: ${company !== null}`,
      );

      if (company === null) {
        this.logger.warn(`[COMPANY] Company with ID ${id} not found`);
        throw this.toHttpException(COMPANY_RESPONSES.notFound(id));
      }

      return COMPANY_RESPONSES.fetched(company);
    } catch (error) {
      return this.handleError(error, 'retrieving');
    }
  }

  async updateCompanyById(
    id: number,
    dto: UpdateCompanyDto,
  ): Promise<CompanyResponse> {
    this.logSeparator('update-company-by-id');
    this.logger.log(`[COMPANY] Processing update for ID ${id}`);
    try {
      this.logger.log(
        `[COMPANY] Querying database to confirm company ID ${id} exists...`,
      );
      const company = await this.companyRepository.findCompanyById(id);
      this.logger.log(
        `[COMPANY] Lookup complete. Target record found: ${company !== null}`,
      );

      if (company === null) {
        this.logger.warn(`[COMPANY] Company with ID ${id} not found`);
        throw this.toHttpException(COMPANY_RESPONSES.notFound(id));
      }

      // Assign only the editable fields, never the raw request body.
      company.companyName = dto.companyName ?? company.companyName;
      company.legalName = dto.legalName ?? company.legalName;
      company.address = dto.address ?? company.address;
      company.email = dto.email ?? company.email;
      company.phone = dto.phone ?? company.phone;
      company.status = dto.status ?? company.status;

      this.logger.log(`[COMPANY] Committing changes for company ID ${id}...`);
      const updated = await this.companyRepository.saveCompany(company);
      this.logger.log(
        `[COMPANY] Changes committed successfully for ID ${updated.id}`,
      );

      return COMPANY_RESPONSES.updated(updated);
    } catch (error) {
      return this.handleError(error, 'updating');
    }
  }

  // Soft delete: the row is kept and marked INACTIVE.
  async deleteCompanyById(id: number): Promise<DeleteResponseDto> {
    this.logSeparator('delete-company-by-id');
    this.logger.log(`[COMPANY] Request to delete company ID ${id}`);
    try {
      this.logger.log(
        `[COMPANY] Locating company ID ${id} targeted for deletion...`,
      );
      const company = await this.companyRepository.findCompanyById(id);
      this.logger.log(
        `[COMPANY] Lookup complete. Target record found: ${company !== null}`,
      );

      if (company === null) {
        this.logger.warn(`[COMPANY] Company with ID ${id} not found`);
        throw this.toHttpException(COMPANY_RESPONSES.notFound(id));
      }

      company.status = 'INACTIVE';

      this.logger.log(
        `[COMPANY] Marking company ID ${id} as INACTIVE in database...`,
      );
      await this.companyRepository.saveCompany(company);
      this.logger.log(`[COMPANY] Company ID ${id} marked INACTIVE successfully.`);

      return COMPANY_RESPONSES.deleted(id, company.companyName);
    } catch (error) {
      return this.handleError(error, 'deleting');
    }
  }

  private logSeparator(title: string): void {
    this.logger.log(`================ ${title} ================`);
  }

  private toHttpException(response: { statusCode: number }): HttpException {
    return new HttpException(response, response.statusCode);
  }

  // Expected errors (404) are already HttpExceptions and pass through unchanged.
  // Anything else is an unexpected failure: log message + stack, return a 500.
  private handleError(error: unknown, action: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    const err = error as Error;
    this.logger.error(
      `[COMPANY] Error ${action} company: ${err.message}`,
      err.stack,
    );
    throw this.toHttpException(COMPANY_RESPONSES.internalError(action));
  }
}