export interface AppConfig {
  port: number;
  cors: CorsConfig;
  swagger: SwaggerConfig;
}

export interface CorsConfig {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export const appConfig: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    // TODO: This is a temporary solution to allow CORS requests from the frontend. I'll update this moving to the .env if this solutions works.
    allowedOrigins: ['http://localhost:5173'],
    allowedMethods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
    ],
    credentials: true,
    maxAge: 86400, // 24 hours
  },
  swagger: {
    title: 'LOTERIA Backend API',
    description: 'API for LOTERIA management system',
    version: '1.0',
    path: 'api',
  },
};
