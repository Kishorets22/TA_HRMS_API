import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({
    description: 'Name of the company',
    example: 'Acme Software Private Limited',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'companyName must be a string' })
  @MaxLength(150, {
    message: 'companyName must be shorter than or equal to 150 characters',
  })
  companyName?: string;

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

  @ApiPropertyOptional({
    description: 'Company status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'status must be ACTIVE or INACTIVE',
  })
  status?: 'ACTIVE' | 'INACTIVE';
}