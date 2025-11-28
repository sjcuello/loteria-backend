import { HttpStatus } from '@nestjs/common';
import { ERROR_CODES } from './error-codes.constant';

/**
 * Oracle error codes and their corresponding HTTP responses
 */
export const ORACLE_ERROR_MAP = {
  'ORA-00001': {
    statusCode: HttpStatus.CONFLICT,
    code: ERROR_CODES.DUPLICATE_ENTRY,
    error: 'Conflicto',
    getMessage: (message: string) => {
      const info = extractConstraintInfo(message);
      return info
        ? `Ya se encuentra registrado el valor '${info.value}'`
        : 'Este valor ya está registrado';
    },
  },
  'ORA-02291': {
    statusCode: HttpStatus.BAD_REQUEST,
    code: ERROR_CODES.FOREIGN_KEY_VIOLATION,
    error: 'Solicitud incorrecta',
    getMessage: () => 'No se encontró el valor relacionado',
  },
  'ORA-02292': {
    statusCode: HttpStatus.CONFLICT,
    code: ERROR_CODES.FOREIGN_KEY_CONSTRAINT,
    error: 'Conflicto',
    getMessage: () =>
      'No se puede eliminar este elemento porque está siendo utilizado en otros lugares',
  },
  'ORA-02290': {
    statusCode: HttpStatus.BAD_REQUEST,
    code: ERROR_CODES.CHECK_CONSTRAINT_VIOLATION,
    error: 'Solicitud incorrecta',
    getMessage: () => 'El valor ingresado no es válido',
  },
  'ORA-01400': {
    statusCode: HttpStatus.BAD_REQUEST,
    code: ERROR_CODES.NOT_NULL_VIOLATION,
    error: 'Solicitud incorrecta',
    getMessage: (message: string) => {
      const column = extractColumnFromNotNull(message);
      return `${column} es requerido y no puede ser nulo`;
    },
  },
} as const;

/**
 * Extracts constraint information from Oracle error message
 */
function extractConstraintInfo(
  message: string,
): { column: string; value: string } | null {
  try {
    const columnMatch = message.match(/columns \(([^)]+)\)/);
    const valueMatch = message.match(/\(.*?:'([^']+)'\)/);

    if (columnMatch && valueMatch) {
      return {
        column: columnMatch[1],
        value: valueMatch[1],
      };
    }
  } catch {
    // Ignore extraction errors
  }
  return null;
}

/**
 * Extracts column name from NOT NULL constraint error
 */
function extractColumnFromNotNull(message: string): string {
  const match = message.match(
    /cannot insert NULL into \(".*?"\.".*?"\."(.*?)"\)/,
  );
  return match ? match[1] : 'campo requerido';
}
