import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity.js';
import { HolidayController } from './holiday.controller.js';
import { HolidayService } from './holiday.service.js';
import { HolidayRepository } from './repositories/holiday.repository.js';
import { CompanyModule } from '../companies/company.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday]),
    CompanyModule,
  ],
  controllers: [HolidayController],
  providers: [HolidayService, HolidayRepository],
})
export class HolidayModule {}