import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { OrganizationService } from './organization.service.js';

import { CreateOrganizationDto } from './dto/create-organization.dto.js';
import { UpdateOrganizationDto } from './dto/update-organization.dto.js';
import { OrganizationQueryDto } from './dto/organization-query.dto.js';

import type {
  OrganizationDeleteResponse,
  OrganizationListResponse,
  OrganizationResponse,
} from './dto/organization-response.dto.js';

// TODO(auth): add AuthGuard once auth exists.
@ApiTags('Organizations')
@Controller('v1')
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);

  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  @Post('organization')
  @ApiOperation({ summary: 'Create a new organization' })
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrganizationResponse> {
    try {
      const response =
        await this.organizationService.createOrganization(createOrganizationDto);

      res.status(response.statusCode);

      return response;
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

  @Get('organizations')
  @ApiOperation({ summary: 'Get all organizations with pagination and filters' })
  async getAllOrganization(
    @Query() organizationQueryDto: OrganizationQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrganizationListResponse> {
    try {
      const response =
        await this.organizationService.getAllOrganization(organizationQueryDto);

      res.status(response.statusCode);

      return response;
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

  @Get('organization/:id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async getOrganizationById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrganizationResponse> {
    try {
      const response = await this.organizationService.getOrganizationById(id);

      res.status(response.statusCode);

      return response;
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

  @Patch('organization/:id')
  @ApiOperation({ summary: 'Update organization by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async updateOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrganizationResponse> {
    try {
      const response = await this.organizationService.updateOrganization(
        id,
        updateOrganizationDto,
      );

      res.status(response.statusCode);

      return response;
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

  @Delete('organization/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete (deactivate) organization by ID',
    description: 'Sets status to INACTIVE instead of deleting the record.',
  })
  @ApiParam({ name: 'id', example: 1 })
  async deleteOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<OrganizationDeleteResponse | OrganizationResponse> {
    try {
      const response = await this.organizationService.deleteOrganization(id);

      res.status(response.statusCode);

      return response;
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
