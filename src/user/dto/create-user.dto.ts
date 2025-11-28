import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { IsCuitCuil } from '../../shared/validators/cuit-cuil.validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Juan',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Perez',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'User DNI',
    example: '12345678',
  })
  @IsString()
  dni!: string;

  @ApiProperty({
    description: 'User CUIL/CUIT',
    example: '20-12345678-9',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsCuitCuil()
  cuil?: string;

  @ApiProperty({
    description: 'Username for login',
    example: 'jperez',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
  })
  @IsString()
  password!: string;

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
