import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { SendEmailDto } from './dto/send-email.dto';
import { SendQRCodeEmailDto, SendTicketEmailDto } from './dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate QR code as base64 data URL
   */
  private async generateQRCode(code: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(code, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrDataUrl;
    } catch (error) {
      this.logger.error('Error generating QR code:', error);
      throw error;
    }
  }

  /**
   * Generate QR code as buffer for email attachments
   */
  private async generateQRCodeBuffer(code: string): Promise<Buffer> {
    try {
      const qrBuffer = await QRCode.toBuffer(code, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        type: 'png',
      });
      return qrBuffer;
    } catch (error) {
      this.logger.error('Error generating QR code buffer:', error);
      throw error;
    }
  }

  /**
   * Send email with QR code
   */
  async sendEmailWithQR(dto: SendQRCodeEmailDto): Promise<void> {
    try {
      const qrCodeBuffer = await this.generateQRCodeBuffer(dto.code);

      await this.mailerService.sendMail({
        to: dto.email,
        subject: dto.subject || 'Your Access Code',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .container {
                  background-color: #f9f9f9;
                  border-radius: 10px;
                  padding: 30px;
                  text-align: center;
                }
                h1 {
                  color: #2c3e50;
                  margin-bottom: 20px;
                }
                .qr-container {
                  background-color: white;
                  padding: 20px;
                  border-radius: 8px;
                  display: inline-block;
                  margin: 20px 0;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #3498db;
                  margin: 20px 0;
                  letter-spacing: 2px;
                }
                .footer {
                  margin-top: 30px;
                  font-size: 12px;
                  color: #7f8c8d;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Hola ${dto.name}!</h1>
                <p>${dto.message || 'Aquí está tu código de acceso:'}</p>
                <div class="code">${dto.code}</div>
                <div class="qr-container">
                  <img src="cid:qrcode" alt="QR Code" style="display: block; max-width: 100%;" />
                </div>
                <p>Escanea este código QR para acceder a tu información.</p>
                <div class="footer">
                  <p>Este código es único. Por favor no lo compartas con otros.</p>
                </div>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBuffer,
            cid: 'qrcode',
          },
        ],
      });

      this.logger.log(`Email with QR code sent successfully to ${dto.email}`);
    } catch (error) {
      this.logger.error('Error sending email with QR code:', error);
      throw error;
    }
  }

  /**
   * Send ticket email with QR code
   */
  async sendTicketEmail(dto: SendTicketEmailDto): Promise<void> {
    try {
      const qrCodeBuffer = await this.generateQRCodeBuffer(dto.ticketCode);

      await this.mailerService.sendMail({
        to: dto.email,
        subject: `Tu Ticket para ${dto.eventName}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
                }
                .ticket {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  border-radius: 15px;
                  padding: 30px;
                  color: white;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .ticket-header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .ticket-header h1 {
                  margin: 0;
                  font-size: 28px;
                }
                .ticket-body {
                  background-color: white;
                  color: #333;
                  padding: 25px;
                  border-radius: 10px;
                  margin: 20px 0;
                }
                .info-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 15px 0;
                  padding: 10px 0;
                  border-bottom: 1px solid #eee;
                }
                .info-label {
                  font-weight: bold;
                  color: #666;
                }
                .qr-section {
                  text-align: center;
                  margin-top: 30px;
                  padding: 20px;
                  background-color: white;
                  border-radius: 10px;
                }
                .ticket-code {
                  font-size: 20px;
                  font-weight: bold;
                  color: #667eea;
                  letter-spacing: 3px;
                  margin: 15px 0;
                }
              </style>
            </head>
            <body>
              <div class="ticket">
                <div class="ticket-header">
                  <h1>🎫 E-Ticket</h1>
                </div>
                
                <div class="ticket-body">
                  <div class="info-row">
                    <span class="info-label">Nombre:</span>
                    <span>${dto.name}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Evento:</span>
                    <span>${dto.eventName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Fecha:</span>
                    <span>${dto.eventDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Ubicación:</span>
                    <span>${dto.location}</span>
                  </div>
                </div>

                <div class="qr-section">
                  <p style="margin: 10px 0; color: #333;">Escanea en la entrada:</p>
                  <img src="cid:qrcode" alt="Ticket QR Code" style="max-width: 250px; display: block; margin: 15px auto;" />
                  <div class="ticket-code">${dto.ticketCode}</div>
                </div>
              </div>
              
              <p style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                Por favor presenta este código QR en la entrada del evento
              </p>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: 'ticket-qr.png',
            content: qrCodeBuffer,
            cid: 'qrcode',
          },
        ],
      });

      this.logger.log(`Ticket email sent successfully to ${dto.email}`);
    } catch (error) {
      this.logger.error('Error sending ticket email:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenido a Lotería Nacional',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .container {
                  background-color: #f9f9f9;
                  border-radius: 10px;
                  padding: 30px;
                  text-align: center;
                }
                h1 {
                  color: #2c3e50;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>¡Bienvenido ${name}!</h1>
                <p>Gracias por registrarte en nuestro sistema.</p>
                <p>Estamos encantados de tenerte con nosotros.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Restablecimiento de Contraseña',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .container {
                  background-color: #f9f9f9;
                  border-radius: 10px;
                  padding: 30px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 30px;
                  background-color: #3498db;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
                }
                .warning {
                  color: #e74c3c;
                  font-size: 14px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Restablecimiento de Contraseña</h1>
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Haz clic en el botón de abajo para restablecer tu contraseña:</p>
                <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                <p class="warning">Este enlace expira en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
              </div>
            </body>
          </html>
        `,
      });
      this.logger.log(`Password reset email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error('Error sending password reset email:', error);
      throw error;
    }
  }

  /**
   * Send custom email
   */
  async sendCustomEmail(dto: SendEmailDto): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: dto.to,
        subject: dto.subject,
        html: dto.html,
        cc: dto.cc,
        bcc: dto.bcc,
        attachments: dto.attachments,
      });
      this.logger.log(`Custom email sent successfully to ${dto.to}`);
    } catch (error) {
      this.logger.error('Error sending custom email:', error);
      throw error;
    }
  }

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmation(
    email: string,
    appointmentDetails: {
      name: string;
      appointmentCode: string;
      date: string;
      time: string;
      location: string;
      purpose: string;
    },
  ): Promise<void> {
    try {
      const qrCodeBuffer = await this.generateQRCodeBuffer(
        appointmentDetails.appointmentCode,
      );

      await this.mailerService.sendMail({
        to: email,
        subject: 'Confirmación de Cita - Lotería Nacional',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .container {
                  background-color: #f9f9f9;
                  border-radius: 10px;
                  padding: 30px;
                }
                .header {
                  background-color: #3498db;
                  color: white;
                  padding: 20px;
                  border-radius: 8px 8px 0 0;
                  text-align: center;
                }
                .details {
                  background-color: white;
                  padding: 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                }
                .detail-row {
                  padding: 10px 0;
                  border-bottom: 1px solid #eee;
                }
                .detail-label {
                  font-weight: bold;
                  color: #666;
                }
                .qr-section {
                  text-align: center;
                  margin: 20px 0;
                  padding: 20px;
                  background-color: white;
                  border-radius: 8px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Confirmación de Cita</h1>
                </div>
                <p>Hola ${appointmentDetails.name},</p>
                <p>Tu cita ha sido confirmada. Aquí están los detalles:</p>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Fecha:</span> ${appointmentDetails.date}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Hora:</span> ${appointmentDetails.time}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Ubicación:</span> ${appointmentDetails.location}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Motivo:</span> ${appointmentDetails.purpose}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Código:</span> ${appointmentDetails.appointmentCode}
                  </div>
                </div>

                <div class="qr-section">
                  <p>Presenta este código QR en tu cita:</p>
                  <img src="cid:qrcode" alt="Appointment QR Code" style="max-width: 250px;" />
                </div>

                <p>Por favor llega 10 minutos antes de tu cita.</p>
              </div>
            </body>
          </html>
        `,
        attachments: [
          {
            filename: 'appointment-qr.png',
            content: qrCodeBuffer,
            cid: 'qrcode',
          },
        ],
      });

      this.logger.log(`Appointment confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending appointment confirmation email:', error);
      throw error;
    }
  }
}
