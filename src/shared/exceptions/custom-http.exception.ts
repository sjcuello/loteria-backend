import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom HTTP exception that allows specifying a user-friendly message
 * while preserving the original error for logging
 */
export class CustomHttpException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly internalError?: Error,
  ) {
    super(message, statusCode);
  }
}

/**
 * Convenience exceptions with custom messages
 */
export class BadRequestException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.BAD_REQUEST, internalError);
  }
}

export class NotFoundException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.NOT_FOUND, internalError);
  }
}

export class ConflictException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.CONFLICT, internalError);
  }
}

export class UnauthorizedException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.UNAUTHORIZED, internalError);
  }
}

export class ForbiddenException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.FORBIDDEN, internalError);
  }
}

export class InternalServerErrorException extends CustomHttpException {
  constructor(message: string, internalError?: Error) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, internalError);
  }
}
