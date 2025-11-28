import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsCuitCuilConstraint implements ValidatorConstraintInterface {
  validate(cuitCuil: string) {
    return this.isValidCuitCuil(cuitCuil);
  }

  defaultMessage() {
    return 'CUIT/CUIL must be a valid format (XX-XXXXXXXX-X or 10-11 digits)';
  }

  private isValidCuitCuil(cuitCuil: string): boolean {
    if (!cuitCuil) return false;

    const cleanCuitCuil = cuitCuil.replace(/[-\s]/g, '');

    if (!/^\d{10,11}$/.test(cleanCuitCuil)) {
      return false;
    }

    const normalizedCuitCuil =
      cleanCuitCuil.length === 10 ? '0' + cleanCuitCuil : cleanCuitCuil;

    const digits = normalizedCuitCuil.split('').map(Number);
    const checkDigit = digits[10];
    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * multipliers[i];
    }

    const remainder = sum % 11;
    let expectedCheckDigit = 11 - remainder;

    if (expectedCheckDigit === 11) {
      expectedCheckDigit = 0;
    } else if (expectedCheckDigit === 10) {
      expectedCheckDigit = 9;
    }

    return checkDigit === expectedCheckDigit;
  }
}

export function IsCuitCuil(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCuitCuilConstraint,
    });
  };
}

export class CuitCuilUtils {
  private static readonly CUIT_CUIL_DEFAULT = '20-12345678-9';
  static format(cuitCuil: string): string {
    if (!cuitCuil) return '';

    const clean = cuitCuil.replace(/[-\s]/g, '');
    if (clean.length !== 10 && clean.length !== 11) return cuitCuil;

    if (clean.length === 10) {
      return `${clean.slice(0, 1)}-${clean.slice(1, 9)}-${clean.slice(9)}`;
    } else {
      return `${clean.slice(0, 2)}-${clean.slice(2, 10)}-${clean.slice(10)}`;
    }
  }

  static clean(cuitCuil: string): string {
    if (!cuitCuil) return '';
    return cuitCuil.replace(/[-\s]/g, '');
  }

  static isValid(cuitCuil: string): boolean {
    const validator = new IsCuitCuilConstraint();
    return validator.validate(cuitCuil) || this.CUIT_CUIL_DEFAULT === cuitCuil;
  }
}
