import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePanelDto {
  @ApiProperty({
    description: 'Panel name',
    example: 'Admin Panel',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Associated role ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  roleId!: number;

  @ApiProperty({
    description: 'Panel active status',
    example: true,
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
