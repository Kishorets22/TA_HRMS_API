import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

export class CompanyResponseDto {
  @ApiProperty({ description: 'Primary key ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Organization ID', example: 1 })
  organizationId: number;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Software Private Limited',
  })
  companyName: string;

  @ApiPropertyOptional({
    description: 'Legal registered name',
    example: 'Acme Software Private Limited',
    nullable: true,
  })
  legalName: string | null;

  @ApiPropertyOptional({
    description: 'Physical or registered address',
    example: '123 Main Street, Chennai',
    nullable: true,
  })
  address: string | null;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'contact@acme.example',
    nullable: true,
  })
  email: string | null;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+1 (555) 123-4567',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    description: 'Company status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  status: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export type CompanyResponse = GenericResponseDto<CompanyResponseDto | null>;

export type CompanyListResponse = GenericListResponseDto<CompanyResponseDto>;