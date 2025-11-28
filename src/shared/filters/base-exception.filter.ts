import { ExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from './interfaces/error-response.interface';

/**
 * Base exception filter with common functionality
 */
export abstract class BaseExceptionFilter implements ExceptionFilter {
  protected abstract readonly logger: Logger;

  abstract catch(exception: unknown, host: ArgumentsHost): void;

  /**
   * Sends a standardized error response
   */
  protected sendErrorResponse(
    response: Response,
    errorResponse: ErrorResponse,
  ): void {
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * Logs the error with appropriate level
   */
  protected logError(
    message: string,
    statusCode: number,
    stack?: string,
  ): void {
    if (statusCode >= 500) {
      this.logger.error(message, stack);
    } else {
      this.logger.warn(message);
    }
  }
}
