import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { SendQRCodeEmailDto, SendTicketEmailDto } from './dto';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-code')
  @ApiOperation({ summary: 'Send email with QR code' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendCode(@Body() dto: SendQRCodeEmailDto) {
    await this.mailService.sendEmailWithQR(dto);
    return {
      success: true,
      message: 'Email with QR code sent successfully',
    };
  }

  @Post('send-ticket')
  @ApiOperation({ summary: 'Send ticket email with QR code' })
  @ApiResponse({ status: 201, description: 'Ticket sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendTicket(@Body() dto: SendTicketEmailDto) {
    await this.mailService.sendTicketEmail(dto);
    return {
      success: true,
      message: 'Ticket sent successfully',
    };
  }

  @Post('send-welcome')
  @ApiOperation({ summary: 'Send welcome email' })
  @ApiResponse({ status: 201, description: 'Welcome email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendWelcome(@Body() body: { email: string; name: string }) {
    await this.mailService.sendWelcomeEmail(body.email, body.name);
    return {
      success: true,
      message: 'Welcome email sent successfully',
    };
  }

  @Post('send-password-reset')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiResponse({
    status: 201,
    description: 'Password reset email sent successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendPasswordReset(@Body() body: { email: string; resetToken: string }) {
    await this.mailService.sendPasswordResetEmail(body.email, body.resetToken);
    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  }
}
