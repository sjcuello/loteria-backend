import { PartialType } from '@nestjs/swagger';
import { CreateHolderDto } from './create-holder.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHolderDto extends PartialType(CreateHolderDto) {
  @ApiProperty({
    description: 'User ID who updated this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
