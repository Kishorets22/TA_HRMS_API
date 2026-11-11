import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateEmployeeDocumentDto {
  @ApiPropertyOptional({
    example: 2,
    description: 'Active document type ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  documentTypeId?: number;

  @ApiPropertyOptional({
    example: 'Degree Certificate',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  documentName?: string;

  @ApiPropertyOptional({
    example: '2024-05-15',
    description: 'Document issue date',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    example: '2029-05-15',
    description: 'Document expiry date',
  })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({
    example: 'Verified original certificate',
    description: 'Additional remarks about the document',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  remarks?: string;
}
