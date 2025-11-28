import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './app.config';

export class SwaggerConfigService {
  static setup(app: INestApplication, config: SwaggerConfig): void {
    const documentBuilder = new DocumentBuilder()
      .setTitle(config.title)
      .setDescription(config.description)
      .setVersion(config.version)
      .addTag('holders', 'Operations related to holders')
      .addTag('panels', 'Operations related to panels')
      .addTag('panel-modules', 'Operations related to panel modules')
      .addTag('roles', 'Operations related to roles')
      .addTag('users', 'Operations related to users')
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
