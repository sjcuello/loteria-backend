import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateInternalNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    example: 'New message',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'You have a new message from the administrator',
    required: true,
  })
  @IsString()
  @MinLength(2)
  message: string;

  @ApiProperty({
    description: 'Notification type (info, warning, error, success)',
    example: 'info',
    required: true,
  })
  @IsString()
  @MaxLength(50)
  type: string;

  @ApiProperty({
    description: 'User ID who receives this notification',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description:
      'Role ID who receives this notification (all users with this role)',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  roleId?: number;

  @ApiProperty({
    description: 'Whether the notification has been read',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
