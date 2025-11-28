import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly dataSource: DataSource) {}

  async checkDatabaseHealth(): Promise<{
    status: string;
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();

      // Check if database connection is established and can execute queries
      if (!this.dataSource.isInitialized) {
        return {
          status: 'error',
        };
      }

      // Execute a simple query to check database connectivity
      await this.dataSource.query('SELECT 1 FROM DUAL');

      const responseTime = Date.now() - startTime;

      return {
        status: 'ok',
        responseTime,
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'error',
      };
    }
  }

  getSystemInfo() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
    };
  }
}
