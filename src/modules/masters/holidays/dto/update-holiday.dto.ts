import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { trim } from './create-holiday.dto.js';

// All fields optional for PATCH; companyId is not editable,
// so a holiday cannot be moved to another company.
export class UpdateHolidayDto {
  @ApiPropertyOptional({
    description: 'Holiday name',
    example: 'Diwali',
    maxLength: 150,
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  holidayName?: string;

  @ApiPropertyOptional({
    description: 'Holiday date in YYYY-MM-DD format',
    example: '2026-11-08',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  holidayDate?: string;

  @ApiPropertyOptional({
    description: 'Holiday type',
    example: 'PUBLIC',
    maxLength: 50,
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(50)
  holidayType?: string;
}
