import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendQRCodeEmailDto {
  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Recipient name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Code to generate QR' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Email subject' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: 'Custom message' })
  @IsOptional()
  @IsString()
  message?: string;
}
