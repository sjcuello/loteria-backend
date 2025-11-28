import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from './base-exception.filter';
import { ValidationTranslator } from './utils/validation-translator.util';
import { ControlAuditService } from '../../control-audit/control-audit.service';
import { CreateControlAuditData } from '../utils/control-audit-data';

interface ValidationErrorResponse {
  message: string | string[];
  error: string;
  statusCode: number;
}

/**
 * Handles validation errors with Spanish translation
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
  protected readonly logger = new Logger(ValidationExceptionFilter.name);
  constructor(private readonly controlAuditService: ControlAuditService) {
    super();
  }
  catch(exception: BadRequestException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    const isValidationError = this.isValidationError(exceptionResponse);
    const statusCode = isValidationError
      ? HttpStatus.UNPROCESSABLE_ENTITY
      : HttpStatus.BAD_REQUEST;

    const errorResponse = exceptionResponse as ValidationErrorResponse;
    const originalMessage =
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
        ? errorResponse.message
        : exceptionResponse;

    this.logError(
      `Validation error: ${JSON.stringify(originalMessage)}`,
      statusCode,
    );
    const translatedMessages = ValidationTranslator.translate(originalMessage);

    // Save audit log
    const request = ctx.getRequest<{ url: string }>();
    const moduleName: string = request.url.replace(/^\//, '').split(/[/?]/)[0];
    if (!moduleName) return;
    const data = CreateControlAuditData.create(true, moduleName, ctx);
    void this.controlAuditService.create(data);

    this.sendErrorResponse(response, {
      success: false,
      statusCode,
      message: translatedMessages,
      error:
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'error' in exceptionResponse
          ? errorResponse.error
          : 'Solicitud incorrecta',
      internalMessage: originalMessage,
    });
  }

  private isValidationError(exceptionResponse: unknown): boolean {
    return (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse &&
      Array.isArray((exceptionResponse as ValidationErrorResponse).message)
    );
  }
}
