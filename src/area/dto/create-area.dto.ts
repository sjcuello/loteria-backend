import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({
    description: 'Area name',
    example: 'Human Resources',
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Area description',
    example: 'Manages employee relations and recruitment',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Area code',
    example: 'HR',
    required: true,
  })
  @IsString()
  codeArea!: string;

  @ApiProperty({
    description: 'Area active status',
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
