import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsNumber } from 'class-validator';
import { IsCuitCuil } from '../../shared/validators/cuit-cuil.validator';

export class CreateVisitorDto {
  @ApiProperty({
    description: 'Visitor NAME',
    example: 'John',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Visitor LAST NAME',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({
    description: 'Visitor DNI',
    example: '12345678',
    required: true,
  })
  @IsString()
  @MaxLength(255)
  dni: string;

  @ApiProperty({
    description: 'Visitor CUIT (Tax Identification Number)',
    example: '20-12345678-9',
    required: true,
  })
  @IsString()
  @IsCuitCuil()
  @MaxLength(255)
  cuit: string;

  @ApiProperty({
    description: 'User ID who created this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  createdBy?: number;
}
