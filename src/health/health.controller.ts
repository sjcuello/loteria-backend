import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint - Liveness probe for K8s' })
  @ApiResponse({
    status: 200,
    description: 'Application is healthy and alive',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        system: {
          type: 'object',
          properties: {
            uptime: { type: 'number', example: 123.456 },
            environment: { type: 'string', example: 'development' },
            nodeVersion: { type: 'string', example: 'v18.0.0' },
          },
        },
      },
    },
  })
  check() {
    const systemInfo = this.healthService.getSystemInfo();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      system: systemInfo,
    };
  }

  @Get('ping')
  @ApiOperation({ summary: 'Simple ping endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Pong response',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'pong' },
      },
    },
  })
  ping() {
    return { message: 'pong' };
  }

  @Get('database')
  @ApiOperation({ summary: 'Database health check - Readiness probe for K8s' })
  @ApiResponse({
    status: 200,
    description: 'Database health status and application readiness',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        database: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            responseTime: { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async checkDatabase() {
    const dbHealth = await this.healthService.checkDatabaseHealth();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
    };
  }
}
