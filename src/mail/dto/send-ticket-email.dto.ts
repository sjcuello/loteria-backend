import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendTicketEmailDto {
  @ApiProperty({ description: 'Recipient email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Recipient name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Ticket code' })
  @IsString()
  ticketCode: string;

  @ApiProperty({ description: 'Event name' })
  @IsString()
  eventName: string;

  @ApiProperty({ description: 'Event date' })
  @IsString()
  eventDate: string;

  @ApiProperty({ description: 'Event location' })
  @IsString()
  location: string;
}
