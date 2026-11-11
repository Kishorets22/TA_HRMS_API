import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveType } from './entities/leave-type.entity.js';
import { LeaveTypeController } from './leave-type.controller.js';
import { LeaveTypeService } from './leave-type.service.js';
import { LeaveTypeRepository } from './repositories/leave-type.repository.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveType]),
  ],
  controllers: [
    LeaveTypeController,
  ],
  providers: [
    LeaveTypeService,
    LeaveTypeRepository,
  ],
  exports: [
    LeaveTypeService,
    LeaveTypeRepository,
  ],
})
export class LeaveTypeModule {}