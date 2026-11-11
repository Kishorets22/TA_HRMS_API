
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

import { DesignationsService } from './designations.service.js';

import { CreateDesignationDto } from './dto/create-designation.dto.js';
import { UpdateDesignationDto } from './dto/update-designation.dto.js';
import { DesignationQueryDto } from './dto/designation-query.dto.js';

import type {
  DesignationListResponse,
  DesignationResponse,
  DesignationDeleteResponse,
} from './dto/designation-response.dto.js';

// TODO(auth): add AuthGuard and company-level authorization once auth exists.
@ApiTags('Designations')
@Controller('v1')
export class DesignationsController {
  private readonly logger = new Logger(DesignationsController.name);

  constructor(
    private readonly designationsService: DesignationsService,
  ) {}

  @Post('designation')
  @ApiOperation({ summary: 'Create a new designation' })
  async createDesignation(
    @Body() createDesignationDto: CreateDesignationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DesignationResponse> {
    try {
      const response =
        await this.designationsService.createDesignation(
          createDesignationDto,
        );

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while creating the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('designations')
  @ApiOperation({
    summary: 'Get all designations with pagination and filters',
  })
  async getAllDesignations(
    @Query() designationQueryDto: DesignationQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DesignationListResponse> {
    try {
      const response =
        await this.designationsService.getAllDesignations(
          designationQueryDto,
        );

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while retrieving all Designations: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Designations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('designation/:id')
  @ApiOperation({ summary: 'Get designation by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async getDesignationById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DesignationResponse> {
    try {
      const response =
        await this.designationsService.getDesignationById(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while retrieving the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('designation/:id')
  @ApiOperation({ summary: 'Update designation by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async updateDesignation(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDesignationDto: UpdateDesignationDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DesignationResponse> {
    try {
      const response =
        await this.designationsService.updateDesignation(
          id,
          updateDesignationDto,
        );

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while updating the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('designation/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete designation by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async deleteDesignation(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DesignationDeleteResponse | DesignationResponse> {
    try {
      const response =
        await this.designationsService.deleteDesignation(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `[DESIGNATION] An error occurred while deleting the Designation: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Designation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
