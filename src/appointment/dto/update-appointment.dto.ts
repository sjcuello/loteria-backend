import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({
    description: 'User ID who updated this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
