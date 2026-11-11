
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UploadEmployeeDocumentDto {
  @ApiProperty({
    example: 101,
    description: 'Employee ID associated with the document',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employeeId: number;

  @ApiProperty({
    example: 2,
    description: 'Document type ID',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  documentTypeId: number;

  @ApiProperty({
    example: 'Degree Certificate',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  documentName: string;

  @ApiProperty({
    example: '2024-05-15',
    description: 'Document issue date',
  })
  @IsDateString()
  issueDate: string;

  @ApiProperty({
    example: '2029-05-15',
    description: 'Document expiry date',
  })
  @IsDateString()
  expiryDate: string;

  @ApiProperty({
    example: 'Verified original certificate',
    description: 'Additional remarks about the document',
  })
  @IsString()
  remarks: string;
}
