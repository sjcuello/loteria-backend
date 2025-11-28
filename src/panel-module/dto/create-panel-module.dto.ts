import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePanelModuleDto {
  @ApiProperty({
    description: 'Panel module name',
    example: 'User Management',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Panel module description',
    example: 'Manage system users and their permissions',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Panel module icon',
    example: 'fas fa-users',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Panel module link/route',
    example: '/users',
    required: true,
  })
  @IsString()
  link!: string;

  @ApiProperty({
    description: 'Associated panel ID',
    example: 1,
    required: true,
  })
  @IsNumber()
  panelId!: number;

  @ApiProperty({
    description: 'Panel module active status',
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
