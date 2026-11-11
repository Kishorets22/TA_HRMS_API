
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmployeesModule } from './modules/masters/employees/employees.module.js';
import { DatabaseModule } from './database/database.module.js';
import { OrganizationModule } from './modules/masters/organizations/organization.module.js';
import { CompanyModule } from './modules/masters/companies/company.module.js';
import { HolidayModule } from './modules/masters/holidays/holiday.module.js';
import { DepartmentsModule } from './modules/masters/departments/departments.module.js';
import { EmploymentTypesModule } from './modules/masters/employment-types/employment-types.module.js';
import { BranchesModule } from './modules/masters/branch/branches.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { LeaveTypeModule } from './modules/leave/leave-types/leave-type.module.js';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EmployeesModule,
    OrganizationModule,
    CompanyModule,
    HolidayModule,
    DepartmentsModule,
    EmploymentTypesModule,
    BranchesModule,
    DocumentsModule,
    LeaveTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
