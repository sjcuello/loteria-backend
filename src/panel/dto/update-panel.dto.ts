import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePanelDto } from './create-panel.dto';

export class UpdatePanelDto extends PartialType(CreatePanelDto) {
  @ApiProperty({
    description: 'User ID who modified this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
