import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  GenericListResponseDto,
  GenericResponseDto,
} from '../../../../common/dto/generics/generic-response.dto.js';

export class OrganizationResponseDto {
  @ApiProperty({ description: 'Primary key ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Corporation',
  })
  organizationName: string;

  @ApiPropertyOptional({
    description: 'Legal registered name',
    example: 'Acme Corporation Limited',
  })
  legalName?: string;

  @ApiPropertyOptional({
    description: 'Physical or registered address',
    example: '123 Main Street, Chennai',
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Contact email address',
    example: 'contact@acme.example',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number',
    example: '+1 (555) 123-4567',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Organization status',
    example: 'ACTIVE',
    enum: ['ACTIVE', 'INACTIVE'],
  })
  status?: string;

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

// DELETE RESPONSE DATA
export class OrganizationDeleteDataDto {
  @ApiProperty({ description: 'Deleted organization ID', example: 1 })
  id: number;
}

// Error responses omit `data`.
export type OrganizationResponse = GenericResponseDto<OrganizationResponseDto>;

export type OrganizationListResponse =
  GenericListResponseDto<OrganizationResponseDto>;

export type OrganizationDeleteResponse =
  GenericResponseDto<OrganizationDeleteDataDto>;
