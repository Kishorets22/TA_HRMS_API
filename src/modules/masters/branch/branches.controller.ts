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

import { BranchesService } from './branches.service.js';

import { CreateBranchDto } from './dto/create-branch.dto.js';
import { UpdateBranchDto } from './dto/update-branch.dto.js';
import { BranchQueryDto } from './dto/branch-query.dto.js';

import type {
  BranchDeleteResponse,
  BranchListResponse,
  BranchResponse,
} from './dto/branch-response.dto.js';

// TODO(auth): add AuthGuard and company-level authorization once auth exists.
@ApiTags('Branches')
@Controller('v1')
export class BranchesController {
  private readonly logger = new Logger(BranchesController.name);

  constructor(
    private readonly branchesService: BranchesService,
  ) {}

  @Post('branch')
  @ApiOperation({ summary: 'Create a new branch' })
  async createBranch(
    @Body() createBranchDto: CreateBranchDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BranchResponse> {
    try {
      const response = await this.branchesService.createBranch(createBranchDto);

      res.status(response.statusCode);

      return response;
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

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches with pagination and filters' })
  async getAllBranch(
    @Query() branchQueryDto: BranchQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BranchListResponse> {
    try {
      const response = await this.branchesService.getAllBranch(branchQueryDto);

      res.status(response.statusCode);

      return response;
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

  @Get('branch/:id')
  @ApiOperation({ summary: 'Get branch by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async getBranchById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BranchResponse> {
    try {
      const response = await this.branchesService.getBranchById(id);

      res.status(response.statusCode);

      return response;
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

  @Patch('branch/:id')
  @ApiOperation({ summary: 'Update branch by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async updateBranch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BranchResponse> {
    try {
      const response = await this.branchesService.updateBranch(id, updateBranchDto);

      res.status(response.statusCode);

      return response;
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

  @Delete('branch/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete branch by ID' })
  @ApiParam({ name: 'id', example: 1 })
  async deleteBranch(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BranchDeleteResponse | BranchResponse> {
    try {
      const response = await this.branchesService.deleteBranch(id);

      res.status(response.statusCode);

      return response;
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
