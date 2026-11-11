
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

export class HolidayResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'Diwali' })
  holidayName: string;

  @ApiProperty({ example: '2026-11-08' })
  holidayDate: string;

  @ApiPropertyOptional({ example: 'PUBLIC' })
  holidayType?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// Error responses omit `data`.
export type HolidayResponse = GenericResponseDto<HolidayResponseDto>;

export type HolidayListResponse =
  GenericListResponseDto<HolidayResponseDto>;
