import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';

export class GenericResponseDto<T> {
  success: boolean;

  message: string;

  @Type(() => Object)
  data?: T;

  errors?: string[];

  statusCode: HttpStatus;
}

// List endpoints add the total number of matching rows for pagination.
export class GenericListResponseDto<T> extends GenericResponseDto<T[]> {
  total?: number;
}