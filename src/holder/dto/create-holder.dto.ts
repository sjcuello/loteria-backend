import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsNumber } from 'class-validator';
import { IsCuitCuil } from '../../shared/validators/cuit-cuil.validator';

export class CreateHolderDto {
  @ApiProperty({
    description: 'Holder CUIT (Tax Identification Number)',
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
