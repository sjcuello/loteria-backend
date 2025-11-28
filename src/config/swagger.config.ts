import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './app.config';

export class SwaggerConfigService {
  static setup(app: INestApplication, config: SwaggerConfig): void {
    const documentBuilder = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version)
      .addTag('visitors', 'Operations related to visitors')
      .addTag('panels', 'Operations related to panels')
      .addTag('panel-modules', 'Operations related to panel modules')
      .addTag('roles', 'Operations related to roles')
      .addTag('users', 'Operations related to users')
      .addTag('areas', 'Operations related to areas')
      .addTag(
        'internal-notifications',
        'Operations related to internal notifications',
      )
      .addTag('control-audits', 'Operations related to control audits')
      .addTag('authentication', 'Operations related to authentication')
      .addTag('appointments', 'Operations related to appointments')
      .addTag('mail', 'Operations related to email sending')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilder);

    SwaggerModule.setup(config.path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
