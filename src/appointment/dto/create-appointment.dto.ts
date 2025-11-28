import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Visitor ID associated with this appointment',
    example: 1,
    required: true,
  })
  @IsNumber()
  visitorId: number;

  @ApiProperty({
    description: 'Reason for the visit',
    example: 'Business meeting to discuss new project',
    required: true,
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: 'User ID associated with this appointment',
    example: 1,
    required: true,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Scheduled start date and time for the visit',
    example: '2024-01-15T10:00:00.000Z',
    required: true,
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Scheduled end date and time for the visit',
    example: '2024-01-15T12:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Indicates if the visit is instant (walk-in)',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isInstant?: boolean;

  @ApiProperty({
    description: 'Actual start date and time when the visit began',
    example: '2024-01-15T10:05:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  effectiveStartDate?: string;

  @ApiProperty({
    description: 'Actual end date and time when the visit ended',
    example: '2024-01-15T12:10:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  effectiveEndDate?: string;

  @ApiProperty({
    description: 'Status of the appointment',
    enum: AppointmentStatus,
    example: AppointmentStatus.APROBADO,
    required: false,
    default: AppointmentStatus.APROBADO,
  })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
