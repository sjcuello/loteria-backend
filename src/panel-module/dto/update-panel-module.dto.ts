import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreatePanelModuleDto } from './create-panel-module.dto';

export class UpdatePanelModuleDto extends PartialType(CreatePanelModuleDto) {
  @ApiProperty({
    description: 'User ID who modified this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedBy?: number;
}
