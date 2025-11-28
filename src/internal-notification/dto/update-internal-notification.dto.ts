import { PartialType } from '@nestjs/swagger';
import { CreateInternalNotificationDto } from './create-internal-notification.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInternalNotificationDto extends PartialType(
  CreateInternalNotificationDto,
) {
  @ApiProperty({
    description: 'User ID who updated this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
