import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

export const trim = ({ value }: TransformFnParams): string =>
  typeof value === 'string' ? value.trim() : value;

export class CreateBranchDto {
  @ApiProperty({
    example: 1,
    description: 'Company ID associated with the branch',
  })
  @Type(() => Number)
  @IsInt({ message: 'Company ID must be a positive number' })
  @Min(1, { message: 'Company ID must be a positive number' })
  companyId: number;

  @ApiProperty({
    example: 'Madurai Branch',
    maxLength: 100,
  })
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  branchName: string;

  @ApiPropertyOptional({
    example: 'Anna Nagar, Madurai',
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
