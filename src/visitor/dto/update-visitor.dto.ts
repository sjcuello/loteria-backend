import { PartialType } from '@nestjs/swagger';
import { CreateVisitorDto } from './create-visitor.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVisitorDto extends PartialType(CreateVisitorDto) {
  @ApiProperty({
    description: 'User ID who updated this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
