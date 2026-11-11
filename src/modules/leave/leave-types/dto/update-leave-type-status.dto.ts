
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateLeaveTypeStatusDto {
  @ApiProperty({
    description: 'Leave type active status',
    example: false,
  })
  @IsBoolean()
  isActive: boolean;
}
