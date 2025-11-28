import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/dto/pagination.dto';

export class PaginationControlAuditDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by status (0 for error, 1 for success)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  filterByStatus?: number;

  @ApiProperty({
    description: 'Filter by status (0 for error, 1 for success)',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  filterStartDate?: Date;

  @ApiProperty({
    description: 'Filter by status (0 for error, 1 for success)',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  filterEndDate?: Date;

  @ApiProperty({
    description: 'Search module name',
    example: 'usos',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  search?: string;
}
