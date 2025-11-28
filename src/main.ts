import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppBootstrapService } from './config/app-bootstrap.service';

async function bootstrap(): Promise<void> {
  // Load environment variables
  dotenv.config();

  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Bootstrap the application with all configurations
  await AppBootstrapService.bootstrap(app);
}

// Start the application
bootstrap().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
