/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  code?: string;
  internalMessage?: unknown;
}

/**
 * Validation error response structure
 */
export interface ValidationErrorResponse extends ErrorResponse {
  internalMessage: string | string[];
}
