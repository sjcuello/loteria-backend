import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateControlAuditDto {
  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: true,
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Operation description',
    example: 'Edit usage name',
    required: true,
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Module name',
    example: 'Usage',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  moduleName: string;

  @ApiProperty({
    description: 'Action type',
    example: 'crear',
    required: true,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  actionType: string;

  @ApiProperty({
    description: 'Operation status',
    example: true,
    required: true,
    default: true,
  })
  @IsBoolean()
  isSuccessfully: boolean;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber()
  createdBy?: number;
}
