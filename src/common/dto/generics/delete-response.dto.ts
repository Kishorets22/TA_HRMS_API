import { ApiProperty } from '@nestjs/swagger';
import type { GenericResponseDto } from './generic-response.dto.js';

export class DeleteDto {
  @ApiProperty({ example: 1 })
  id: number;
}

export type DeleteResponseDto = GenericResponseDto<DeleteDto | null>;