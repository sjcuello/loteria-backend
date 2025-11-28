import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { appConfig } from './app.config';
import { SwaggerConfigService } from './swagger.config';

export class AppBootstrapService {
  private static readonly logger = new Logger(AppBootstrapService.name);

  static async bootstrap(app: INestApplication): Promise<void> {
    // Configure global validation pipe
    this.logger.log('🔧 Configuring global validation...');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
        validateCustomDecorators: true,
      }),
    );

    // Configure CORS using middleware (handled in app.module.ts)
    this.logger.log('🚀 Configuring CORS middleware...');

    // Configure Swagger
    this.logger.log('📚 Setting up Swagger documentation...');
    SwaggerConfigService.setup(app, appConfig.swagger);

    // Start the application
    const port = appConfig.port;
    await app.listen(port);

    this.logger.log(`🚀 Application running on http://localhost:${port}`);
    this.logger.log(
      `📚 Swagger documentation available at http://localhost:${port}/${appConfig.swagger.path}`,
    );
  }
}
