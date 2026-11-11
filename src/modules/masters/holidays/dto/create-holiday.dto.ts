
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { Transform, Type, type TransformFnParams } from 'class-transformer';

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class CreateHolidayDto {
  @ApiProperty({
    description: 'Company ID',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  companyId: number;

  @ApiProperty({
    description: 'Holiday name',
    example: 'Diwali',
    maxLength: 150,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  holidayName: string;

  @ApiProperty({
    description: 'Holiday date in YYYY-MM-DD format',
    example: '2026-11-08',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  holidayDate: string;

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
