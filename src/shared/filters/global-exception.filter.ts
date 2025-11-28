import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from './base-exception.filter';
import { ControlAuditService } from '../../control-audit/control-audit.service';
import { CreateControlAuditData } from '../utils/control-audit-data';

interface HttpErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Global exception filter that handles all exceptions
 * Acts as a catch-all for any unhandled exceptions
 */
@Injectable()
@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  protected readonly logger = new Logger(GlobalExceptionFilter.name);
  constructor(private readonly controlAuditService: ControlAuditService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Save audit log
    const request = ctx.getRequest<{ url: string }>();
    const moduleName: string = request.url.replace(/^\//, '').split(/[/?]/)[0];
    if (!moduleName) return;
    const data = CreateControlAuditData.create(true, moduleName, ctx);
    void this.controlAuditService.create(data);

    // Handle HttpException instances
    if (exception instanceof HttpException) {
      this.handleHttpException(exception, response);
      return;
    }

    // Handle all other exceptions
    this.handleUnknownException(exception, response);
  }

  /**
   * Handles standard HTTP exceptions
   */
  private handleHttpException(
    exception: HttpException,
    response: Response,
  ): void {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    this.logError(
      `HTTP Exception: ${status} - ${JSON.stringify(exceptionResponse)}`,
      status,
      exception.stack,
    );

    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = exception.name;
    } else {
      const errorResponse = exceptionResponse as HttpErrorResponse;
      message = errorResponse.message || exception.message;
      error = errorResponse.error || exception.name;
    }

    this.sendErrorResponse(response, {
      success: false,
      statusCode: status,
      message,
      error,
    });
  }

  /**
   * Handles unexpected/unknown exceptions
   */
  private handleUnknownException(exception: unknown, response: Response): void {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error
        ? exception.message
        : 'Error interno del servidor';

    this.logError(
      `Unhandled exception: ${message}`,
      status,
      exception instanceof Error ? exception.stack : undefined,
    );

    this.sendErrorResponse(response, {
      success: false,
      statusCode: status,
      message: message || 'Ocurrió un error inesperado',
      error: 'Error interno del servidor',
    });
  }
}
