import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { IsCuitCuil } from '../../shared/validators/cuit-cuil.validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Role ID assigned to the user',
    example: 1,
  })
  @IsNumber()
  roleId!: number;

  @ApiProperty({
    description: 'Indicates if the user is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({
    description: 'User CUIT',
    example: '20-12345678-9',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsCuitCuil()
  cuil?: string;

  @ApiProperty({
    description: 'User ID who is creating this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  createdById?: number;

  @ApiProperty({
    description: 'User ID who is modifying this record',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  updatedById?: number;
}
