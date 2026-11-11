import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'ID of the organization this company belongs to',
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'organizationId must be a positive number' })
  @Min(1, { message: 'organizationId must be a positive number' })
  organizationId: number;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Software Private Limited',
    maxLength: 150,
  })
  @IsString({ message: 'companyName must be a string' })
  @IsNotEmpty({ message: 'companyName should not be empty' })
  @MaxLength(150, {
    message: 'companyName must be shorter than or equal to 150 characters',
  })
  companyName: string;

  @ApiPropertyOptional({
    description: 'Legal registered name',
    example: 'Acme Software Private Limited',
    maxLength: 200,
  })
  @IsOptional()
  @IsString({ message: 'legalName must be a string' })
  @MaxLength(200, {
    message: 'legalName must be shorter than or equal to 200 characters',
  })
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Physical or registered address',
    example: '123 Main Street, Chennai',
  })
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'contact@acme.example',
    maxLength: 150,
  })
  @IsOptional()
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(150, {
    message: 'email must be shorter than or equal to 150 characters',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+1 (555) 123-4567',
    maxLength: 20,
  })
  @IsOptional()
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: 'phone must be 7-20 digits/characters',
  })
  phone?: string;
}