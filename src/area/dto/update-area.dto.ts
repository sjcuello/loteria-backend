import { PartialType } from '@nestjs/swagger';
import { CreateAreaDto } from './create-area.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @ApiProperty({
    description: 'User ID who modified this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
