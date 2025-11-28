import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class BulkMarkNotificationsDto {
  @ApiProperty({
    description: 'Array of notification IDs to mark as read/unread',
    example: [1, 2, 3, 4, 5],
    type: [Number],
    required: true,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIds: number[];

  @ApiProperty({
    description: 'Read status to set for the notifications',
    example: true,
    required: true,
  })
  @IsBoolean()
  isRead: boolean;
}
