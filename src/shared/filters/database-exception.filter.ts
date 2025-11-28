import { Catch, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from './base-exception.filter';
import { ORACLE_ERROR_MAP } from './constants/oracle-errors.constant';
import { ERROR_CODES } from './constants/error-codes.constant';
import { ControlAuditService } from '../../control-audit/control-audit.service';
import { CreateControlAuditData } from '../utils/control-audit-data';

interface OracleError extends Error {
  code?: string;
  errorNum?: number;
  offset?: number;
}

/**
 * Handles TypeORM database errors, especially Oracle-specific errors
 */
@Catch(QueryFailedError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  protected readonly logger = new Logger(DatabaseExceptionFilter.name);
  constructor(private readonly controlAuditService: ControlAuditService) {
    super();
  }

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const oracleError = exception.driverError as OracleError;
    const errorCode = oracleError?.code;

    this.logError(
      `Database error: ${errorCode || 'UNKNOWN'} - ${exception.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      exception.stack,
    );

    // Save audit log
    const request = ctx.getRequest<{ url: string }>();
    const moduleName: string = request.url.replace(/^\//, '').split(/[/?]/)[0];
    if (!moduleName) return;
    const data = CreateControlAuditData.create(true, moduleName, ctx);
    void this.controlAuditService.create(data);

    // Handle known Oracle errors
    if (errorCode && this.isKnownOracleError(errorCode)) {
      const errorConfig = ORACLE_ERROR_MAP[errorCode];
      this.sendErrorResponse(response, {
        success: false,
        statusCode: errorConfig.statusCode,
        message: errorConfig.getMessage(exception.message),
        error: errorConfig.error,
        code: errorConfig.code,
      });
      return;
    }

    // Default database error response
    this.sendErrorResponse(response, {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Ocurrió un error en la base de datos',
      error: 'Error interno del servidor',
      code: errorCode || ERROR_CODES.DATABASE_ERROR,
    });
  }

  /**
   * Type guard to check if error code is a known Oracle error
   */
  private isKnownOracleError(
    code: string,
  ): code is keyof typeof ORACLE_ERROR_MAP {
    return code in ORACLE_ERROR_MAP;
  }
}
