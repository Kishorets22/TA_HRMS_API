import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity.js';
import type { CreateCompanyDto } from '../dto/create-company.dto.js';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {}

  async createAndSaveCompany(dto: CreateCompanyDto): Promise<Company> {
    const company = this.repository.create({ ...dto, status: 'ACTIVE' });
    return await this.repository.save(company);
  }

  async saveCompany(company: Company): Promise<Company> {
    return await this.repository.save(company);
  }

  async findCompanyById(id: number): Promise<Company | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAllCompanies(
    page: number,
    limit: number,
    search?: string,
    status?: 'ACTIVE' | 'INACTIVE',
    organizationId?: number,
  ): Promise<[Company[], number]> {
    const query = this.repository
      .createQueryBuilder('company')
      .orderBy('company.companyName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status !== undefined) {
      query.andWhere('company.status = :status', { status });
    }

    if (organizationId !== undefined) {
      query.andWhere('company.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search !== undefined && search.length > 0) {
      query.andWhere('company.companyName ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return await query.getManyAndCount();
  }
}