import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { trim } from './create-organization.dto.js';

// All fields optional for PATCH
export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Name of the organization',
    example: 'Acme Corporation',
    maxLength: 255,
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'organizationName must be a string' })
  @IsNotEmpty({ message: 'organizationName should not be empty' })
  @MaxLength(255, {
    message: 'organizationName must be shorter than or equal to 255 characters',
  })
  organizationName?: string;

  @ApiPropertyOptional({
    description: 'Legal registered name',
    example: 'Acme Corporation Limited',
    maxLength: 255,
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'legalName must be a string' })
  @MaxLength(255, {
    message: 'legalName must be shorter than or equal to 255 characters',
  })
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Physical or registered address',
    example: '123 Main Street, Chennai',
  })
  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'address must be a string' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'contact@acme.example',
    maxLength: 150,
  })
  @IsOptional()
  @Transform(trim)
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
    description: 'Organization status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE'], {
    message: 'status must be ACTIVE or INACTIVE',
  })
  status?: 'ACTIVE' | 'INACTIVE';
}
