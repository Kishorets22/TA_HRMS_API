import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { HolidayService } from './holiday.service.js';

import { CreateHolidayDto } from './dto/create-holiday.dto.js';
import { UpdateHolidayDto } from './dto/update-holiday.dto.js';
import { HolidayQueryDto } from './dto/holiday-query.dto.js';

import type { HolidayDeleteResponse } from './constants/holiday.constants.js';

import type {
  HolidayListResponse,
  HolidayResponse,
} from './dto/holiday-response.dto.js';

// TODO(auth): Add authentication and company-level authorization.

@ApiTags('Holidays')
@Controller('v1/holidays')
export class HolidayController {
  private readonly logger = new Logger(HolidayController.name);

  constructor(
    private readonly holidayService: HolidayService,
  ) {}

  // CREATE HOLIDAY
  @Post('holiday')
  @ApiOperation({ summary: 'Create a new holiday' })
  async createHoliday(
    @Body()
    createHolidayDto: CreateHolidayDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HolidayResponse> {
    try {
      const response =
        await this.holidayService.createHoliday(createHolidayDto);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
       this.logger.error(
        `[HOLIDAY] An error occurred while creating the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while creating the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET ALL HOLIDAYS
  @Get('holidays')
  @ApiOperation({
    summary: 'Get all holidays with pagination and filters',
  })
  async getAllHolidays(
    @Query() holidayQueryDto: HolidayQueryDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HolidayListResponse | HolidayResponse> {
    try {
      const response =
        await this.holidayService.retrievingAllHolidays(holidayQueryDto);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `[HOLIDAY] An error occurred while retrieving all Holidays: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving all Holidays',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // GET HOLIDAY BY ID
  @Get('holiday/:id')
  @ApiOperation({ summary: 'Get holiday by ID' })
  @ApiParam({ name: 'id', example: '9' })
  async getHolidayById(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HolidayResponse> {
    try {
      const response = await this.holidayService.retrievingHolidayById(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
        this.logger.error(
        `[HOLIDAY] An error occurred while retrieving the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while retrieving the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // UPDATE HOLIDAY
  @Patch('holiday/:id')
  @ApiOperation({ summary: 'Update holiday by ID' })
  @ApiParam({ name: 'id', example: '9' })
  async updateHolidayDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateHolidayDto: UpdateHolidayDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HolidayResponse> {
    try {
      const response = await this.holidayService.updateHoliday(
        id,
        updateHolidayDto,
      );

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
            this.logger.error(
        `[HOLIDAY] An error occurred while updating the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while updating the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // DELETE HOLIDAY
  @Delete('holiday/:id')
  @ApiOperation({ summary: 'Delete holiday by ID' })
  @ApiParam({ name: 'id', example: '9' })
  async deleteHoliday(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HolidayDeleteResponse | HolidayResponse> {
    try {
      const response = await this.holidayService.deleteHoliday(id);

      res.status(response.statusCode);

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
            this.logger.error(
        `[HOLIDAY] An error occurred while deleting the Holiday: ${(error as Error).message}`,
        (error as Error).stack,
      );

      throw new HttpException(
        'An error occurred while deleting the Holiday',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
