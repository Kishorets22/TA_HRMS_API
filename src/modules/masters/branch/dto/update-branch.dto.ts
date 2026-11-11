import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { trim } from './create-branch.dto.js';

// All fields optional for PATCH; companyId is not editable,
// so a branch cannot be moved to another company.
export class UpdateBranchDto {
  @ApiPropertyOptional({
    example: 'Madurai Main Branch',
    maxLength: 100,
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  branchName?: string;

  @ApiPropertyOptional({
    example: 'Anna Nagar, Madurai',
  })
  @IsOptional()
  @Transform(trim)
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
