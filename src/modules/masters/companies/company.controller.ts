import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COMPANY_RESPONSES } from './constants/company.constants.js';
import { CompanyQueryDto } from './dto/company-query.dto.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import type {
  CompanyListResponse,
  CompanyResponse,
} from './dto/company-response.dto.js';
import type { DeleteResponseDto } from '../../../common/dto/generics/delete-response.dto.js';
import { CompanyService } from './company.service.js';

// TODO(auth): add AuthGuard and pass req.user.id to the service once auth exists.
@ApiTags('Companies')
@Controller('v1')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('company')
  async createCompany(@Body() dto: CreateCompanyDto): Promise<CompanyResponse> {
    try {
      return await this.companyService.createCompany(dto);
    } catch (error) {
      return this.handleError(error, 'creating');
    }
  }

  @Get('companies')
  async getAllCompanies(
    @Query() query: CompanyQueryDto,
  ): Promise<CompanyListResponse> {
    try {
      return await this.companyService.getAllCompanies(query);
    } catch (error) {
      return this.handleError(error, 'retrieving');
    }
  }

  @Get('company/:id')
  async getCompanyById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompanyResponse> {
    try {
      return await this.companyService.getCompanyById(id);
    } catch (error) {
      return this.handleError(error, 'retrieving');
    }
  }

  @Patch('company/:id')
  async updateCompanyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponse> {
    try {
      return await this.companyService.updateCompanyById(id, dto);
    } catch (error) {
      return this.handleError(error, 'updating');
    }
  }

  @Delete('company/:id')
  async deleteCompanyById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteResponseDto> {
    try {
      return await this.companyService.deleteCompanyById(id);
    } catch (error) {
      return this.handleError(error, 'deleting');
    }
  }

  // HttpExceptions from the service (404) keep their status code;
  // anything unexpected becomes a 500.
  private handleError(error: unknown, action: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    const response = COMPANY_RESPONSES.internalError(action);
    throw new HttpException(response, response.statusCode);
  }
}