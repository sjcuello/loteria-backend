/**
 * Utility for translating validation error messages to Spanish
 */
export class ValidationTranslator {
  private static readonly TRANSLATION_MAP: Record<string, RegExp> = {
    'no debe estar vacío': /should not be empty/i,
    'no debe existir': /should not exist/i,
    'no puede estar vacío': /must not be empty/i,
    'es requerido': /is required/i,
    'debe ser un texto': /must be a string/i,
    'debe ser un número': /must be a number/i,
    'debe ser un entero': /must be an integer/i,
    'debe ser un booleano': /must be a boolean/i,
    'debe ser una fecha': /must be a date/i,
    'debe ser un email válido': /must be an? email/i,
    'debe ser una URL válida': /must be an? url/i,
    'es demasiado corto': /is too short/i,
    'es demasiado largo': /is too long/i,
    'debe tener al menos': /must be at least/i,
    'debe tener como máximo': /must be at most/i,
    'debe ser mayor que': /must be greater than/i,
    'debe ser menor que': /must be less than/i,
    'debe ser un valor positivo': /must be positive/i,
    'debe ser un valor negativo': /must be negative/i,
    'debe ser un array': /must be an array/i,
    'debe ser un objeto': /must be an object/i,
    'no es válido': /is not valid/i,
    'debe coincidir con': /must match/i,
    'formato inválido': /invalid format/i,
  };

  private static readonly REPLACEMENT_PATTERNS: Array<{
    pattern: RegExp;
    replacement: string;
  }> = [
    {
      pattern: /property\s+(\w+)\s+should not exist/gi,
      replacement: 'la propiedad $1 no debe existir',
    },
    {
      pattern: /property\s+(\w+)\s+should not be empty/gi,
      replacement: 'la propiedad $1 no debe estar vacía',
    },
    { pattern: /must be a string/gi, replacement: 'debe ser un texto' },
    { pattern: /must be a number/gi, replacement: 'debe ser un número' },
    { pattern: /must be an integer/gi, replacement: 'debe ser un entero' },
    { pattern: /must be a boolean/gi, replacement: 'debe ser un booleano' },
    { pattern: /must be a date/gi, replacement: 'debe ser una fecha' },
    {
      pattern: /must be an? email/gi,
      replacement: 'debe ser un email válido',
    },
    { pattern: /must be an? url/gi, replacement: 'debe ser una URL válida' },
    { pattern: /should not be empty/gi, replacement: 'no debe estar vacío' },
    { pattern: /should not exist/gi, replacement: 'no debe existir' },
    { pattern: /must not be empty/gi, replacement: 'no puede estar vacío' },
    { pattern: /is required/gi, replacement: 'es requerido' },
    {
      pattern: /must be positive/gi,
      replacement: 'debe ser un valor positivo',
    },
    {
      pattern: /must be negative/gi,
      replacement: 'debe ser un valor negativo',
    },
    { pattern: /must be an array/gi, replacement: 'debe ser un array' },
    { pattern: /must be an object/gi, replacement: 'debe ser un objeto' },
    { pattern: /is not valid/gi, replacement: 'no es válido' },
    { pattern: /invalid format/gi, replacement: 'formato inválido' },
  ];

  /**
   * Translates validation messages to Spanish
   */
  static translate(messages: unknown): string | string[] {
    if (typeof messages === 'string') {
      return this.translateMessage(messages);
    }

    if (Array.isArray(messages)) {
      return messages.map(msg =>
        typeof msg === 'string' ? this.translateMessage(msg) : String(msg),
      );
    }

    return 'Error de validación';
  }

  /**
   * Translates a single validation message to Spanish
   */
  private static translateMessage(message: string): string {
    // Try pattern-based translation first
    for (const [spanish, pattern] of Object.entries(this.TRANSLATION_MAP)) {
      if (pattern.test(message)) {
        return this.extractPropertyAndTranslate(message, spanish);
      }
    }

    // Apply replacement patterns
    let translatedMessage = message;
    for (const { pattern, replacement } of this.REPLACEMENT_PATTERNS) {
      translatedMessage = translatedMessage.replace(pattern, replacement);
    }

    return translatedMessage;
  }

  /**
   * Extracts property name and builds translated message
   */
  private static extractPropertyAndTranslate(
    message: string,
    translation: string,
  ): string {
    const propertyMatch = message.match(/property\s+(\w+)/i);
    const fieldMatch = message.match(/^(\w+)\s+/);

    if (propertyMatch) {
      return `la propiedad ${propertyMatch[1]} ${translation}`;
    }

    if (fieldMatch) {
      return `${fieldMatch[1]} ${translation}`;
    }

    return translation;
  }
}
